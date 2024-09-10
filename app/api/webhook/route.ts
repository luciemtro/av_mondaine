import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getConnection } from "@/app/lib/db";
import { ResultSetHeader } from "mysql2/promise"; // Importer ResultSetHeader

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const runtime = "nodejs"; // Utilisation du runtime Node.js

// Désactiver le parsing automatique pour recevoir le corps brut
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
      // Cast explicit de 'err' en Error pour accéder à ses propriétés
      const error = err as Error;
      console.log(
        `⚠️ Erreur lors de la validation du webhook : ${error.message}`
      );
      return NextResponse.json(
        { error: `Erreur Webhook: ${error.message}` },
        { status: 400 }
      );
    }

    // Vérification de l'événement 'checkout.session.completed'
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
          // Insérer la commande dans la table "orders"
          const insertOrderQuery = `
            INSERT INTO orders (
              first_name, last_name, email, phone, event_address, event_city,
              event_postal_code, event_country, event_date, number_of_people,
              service_type, budget, comment, total_fee, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `;

          const orderValues = [
            session.metadata?.first_name || "", // Si la valeur est undefined, utilise une chaîne vide
            session.metadata?.last_name || "",
            session.customer_details?.email || "", // Assurer que l'email est présent
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
            session.amount_total / 100, // Montant total en euros
          ];

          console.log("Données pour l'insertion dans `orders` :", orderValues);
          console.log("Métadonnées reçues :", session.metadata);

          const [result] = await conn.execute<ResultSetHeader>(
            insertOrderQuery,
            orderValues
          );
          const orderId = result.insertId; // Récupérer l'ID de la commande insérée
          console.log(`Commande insérée avec succès, ID : ${orderId}`);

          // Insérer les relations dans la table "order_artists"
          const selectedArtists = JSON.parse(
            session.metadata?.selected_artists || "[]"
          );
          const insertOrderArtistQuery = `
            INSERT INTO order_artists (order_id, artist_id)
            VALUES (?, ?)
          `;

          for (const artistId of selectedArtists) {
            await conn.execute(insertOrderArtistQuery, [orderId, artistId]);
            console.log(`Artiste ${artistId} associé à la commande ${orderId}`);
          }
        } catch (err) {
          const error = err as Error; // Cast explicite de l'erreur
          console.error(
            "Erreur lors de l'insertion dans la base de données :",
            error
          );
          return NextResponse.json(
            { error: "Erreur lors de l'insertion de la commande" },
            { status: 500 }
          );
        } finally {
          conn.release(); // Libérer la connexion
        }
      } else {
        console.log("Le montant total est nul. Aucun traitement n'est fait.");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const error = err as Error; // Cast explicite pour accéder à 'message'
    console.log(`⚠️ Erreur générale dans le webhook : ${error.message}`);
    return NextResponse.json(
      { error: `Erreur: ${error.message}` },
      { status: 500 }
    );
  }
}
