import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getConnection } from "@/app/lib/db";
import { sendEmail } from "@/app/lib/mailer"; // Importer la fonction d'envoi d'email
import { ResultSetHeader } from "mysql2/promise";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function streamToBuffer(
  stream: ReadableStream<Uint8Array> | null
): Promise<Buffer> {
  if (!stream) {
    throw new Error("Le corps de la requête est vide.");
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  let done = false;
  while (!done) {
    const { done: readerDone, value } = await reader.read();
    done = readerDone;
    if (value) {
      chunks.push(value);
    }
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    console.log("Requête POST reçue à /api/webhook");

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      console.log("Aucune signature Stripe détectée");
      return NextResponse.json(
        { error: "Aucune signature Stripe détectée" },
        { status: 400 }
      );
    }

    const rawBody = await streamToBuffer(req.body);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log("Événement Stripe décodé :", event);
    } catch (err) {
      const error = err as Error;
      console.log(
        `⚠️ Erreur lors de la validation du webhook : ${error.message}`
      );
      return NextResponse.json(
        { error: `Erreur Webhook: ${error.message}` },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.amount_total !== null) {
        console.log(
          `Paiement reçu pour la session ${session.id}, montant total : ${
            session.amount_total / 100
          } €`
        );

        const conn = await getConnection();

        try {
          const insertOrderQuery = `
            INSERT INTO orders (
              first_name, last_name, email, phone, event_address, event_city,
              event_postal_code, event_country, event_date, number_of_people,
              service_type, budget, comment, total_fee, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `;

          const orderValues = [
            session.metadata?.first_name || "",
            session.metadata?.last_name || "",
            session.customer_details?.email || "",
            session.metadata?.phone || "",
            session.metadata?.event_address || "",
            session.metadata?.event_city || "",
            session.metadata?.event_postal_code || "",
            session.metadata?.event_country || "",
            session.metadata?.event_date || null,
            session.metadata?.number_of_people || 0,
            session.metadata?.service_type || "",
            session.metadata?.budget || 0,
            session.metadata?.comment || "",
            session.amount_total / 100,
          ];

          const [result] = await conn.execute<ResultSetHeader>(
            insertOrderQuery,
            orderValues
          );
          const orderId = result.insertId;
          console.log(`Commande insérée avec succès, ID : ${orderId}`);

          // Envoi d'un email de confirmation à l'admin et au client
          const adminEmail = process.env.ADMIN_EMAIL!;
          const customerEmail = session.customer_details?.email || "";

          const emailBody = `
            Nouvelle commande reçue pour ${session.metadata?.first_name} ${
            session.metadata?.last_name
          }.
            Détails :
            - Montant: ${session.amount_total / 100} €
            - Événement: ${session.metadata?.event_date}, ${
            session.metadata?.event_address
          }, ${session.metadata?.event_city}
            - Artistes: ${session.metadata?.selected_artists || "Aucun"}
          `;

          // Envoyer un email à l'admin
          await sendEmail(adminEmail, "Nouvelle commande reçue", emailBody);

          // Envoyer un email de confirmation au client
          const customerEmailBody = `
            Bonjour ${session.metadata?.first_name},
            
            Merci pour votre commande ! Voici un récapitulatif de votre réservation :
            - Montant: ${session.amount_total / 100} €
            - Événement: ${session.metadata?.event_date}, ${
            session.metadata?.event_address
          }, ${session.metadata?.event_city}
            
            Nous vous recontacterons sous peu.

            Merci,
            L'équipe
          `;
          await sendEmail(
            customerEmail,
            "Confirmation de votre commande",
            customerEmailBody
          );

          console.log("Emails envoyés avec succès.");
        } catch (err) {
          const error = err as Error;
          console.error(
            "Erreur lors de l'insertion dans la base de données :",
            error
          );
          return NextResponse.json(
            { error: "Erreur lors de l'insertion de la commande" },
            { status: 500 }
          );
        } finally {
          conn.release();
        }
      } else {
        console.log("Le montant total est nul. Aucun traitement n'est fait.");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const error = err as Error;
    console.log(`⚠️ Erreur générale dans le webhook : ${error.message}`);
    return NextResponse.json(
      { error: `Erreur: ${error.message}` },
      { status: 500 }
    );
  }
}
