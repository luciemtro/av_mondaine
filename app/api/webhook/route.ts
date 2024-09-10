import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getConnection } from "@/app/lib/db";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Désactiver le parsing automatique de Next.js pour recevoir le corps brut
export const config = {
  api: {
    bodyParser: false,
  },
};

// Fonction pour convertir ReadableStream en Buffer
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
      if (err instanceof Error) {
        console.log(
          `⚠️ Erreur lors de la validation du webhook : ${err.message}`
        );
        return NextResponse.json(
          { error: `Erreur Webhook: ${err.message}` },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Erreur inconnue lors du traitement du webhook" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Vérification de `amount_total`
      if (session.amount_total !== null) {
        console.log(
          `Paiement reçu pour la session ${session.id}, montant total : ${
            session.amount_total / 100
          } €`
        );

        // Obtenir une connexion à la base de données
        const conn = await getConnection();

        try {
          // Insertion des informations dans la table "orders"
          const query = `
              INSERT INTO orders (session_id, amount, email, payment_status, created_at)
              VALUES (?, ?, ?, ?, NOW())
            `;
          const values = [
            session.id, // ID de la session Stripe
            session.amount_total / 100, // Montant total payé (converti en euros/dollars)
            session.customer_details?.email, // Email du client
            session.payment_status, // Statut du paiement
          ];

          await conn.execute(query, values);
          console.log("Commande insérée dans la base de données");
        } catch (err) {
          console.error(
            "Erreur lors de l'insertion dans la base de données :",
            err
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
    if (err instanceof Error) {
      console.log(`⚠️ Erreur générale dans le webhook : ${err.message}`);
      return NextResponse.json(
        { error: `Erreur: ${err.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
  }
}
