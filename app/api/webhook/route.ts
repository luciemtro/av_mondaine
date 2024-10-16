import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getConnection } from "@/app/lib/db";
import { sendEmail } from "@/app/lib/mailer";
import { ResultSetHeader } from "mysql2/promise";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const runtime = "nodejs";

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
              event_postal_code, event_country, event_date, event_hour, number_of_people,
              service_type, budget, comment, total_fee, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
            session.metadata?.event_hour || null,
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

          const selectedArtists = JSON.parse(
            session.metadata?.selected_artists || "[]"
          );

          if (selectedArtists.length > 0) {
            console.log(
              `Artistes sélectionnés : ${JSON.stringify(selectedArtists)}`
            );

            const insertOrderArtistSql = `
                INSERT INTO order_artists (order_id, artist_id) VALUES (?, ?)
              `;

            for (const artist of selectedArtists) {
              console.log(
                `Tentative d'association de l'artiste ${artist.id} à la commande ${orderId}`
              );

              const [artistResult] = await conn.execute<ResultSetHeader>(
                insertOrderArtistSql,
                [orderId, artist.id]
              );

              console.log(
                `Artiste ${artist.id} associé à la commande ${orderId} avec succès.`
              );
            }

            console.log("Tous les artistes ont été associés avec succès.");
          } else {
            console.log("Aucun artiste associé à la commande.");
          }

          const adminEmail = process.env.ADMIN_EMAIL!;
          const customerEmail = session.customer_details?.email || "";

          const emailBody = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        background-color: #1b1b1b;
        color: #eaeaea;
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #2a2a2a;
        border-radius: 10px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
      }
      .header img {
        width: 150px;
        height: auto;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      h1 {
        color: #ff007f;
        text-align: center;
        font-size: 24px;
      }
      p {
        font-size: 16px;
        margin: 10px 0;
        color: #d4d4d4;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        font-size: 16px;
        color: #d4d4d4;
        margin-bottom: 10px;
      }
      .button {
        display: block;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        padding: 20px;
      }

      strong {
        color: #ff007f;
      }
      .white {
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://i.ibb.co/JKJPZmp/avenue-mondaine-logo-mail.png" alt="Avenue Mondaine Logo">
      </div>
      <div class="content">
        <h1>Nouvelle commande reçue</h1>
        <p>Bonjour,</p>
        <p>Une nouvelle commande vient d'être confirmée. Voici les détails de la réservation :</p>
        <ul>
          <li><strong>Nom :</strong> ${session.metadata?.first_name} ${
            session.metadata?.last_name
          }</li>
          <li><strong>Email :</strong> ${session.customer_details?.email}</li>
          <li><strong>Montant :</strong> ${session.amount_total / 100} €</li>
          <li><strong>Adresse de l'événement :</strong> ${
            session.metadata?.event_address
          }, ${session.metadata?.event_city}</li>
          <li><strong>Date de l'événement :</strong> ${
            session.metadata?.event_date
          }</li>
          <li><strong>Artistes sélectionnés :</strong> ${
            session.metadata?.selected_artists || "Aucun"
          }</li>
          <li><strong>Type de service :</strong> ${
            session.metadata?.service_type
          }</li>
        </ul>
        <p>Veuillez vous connecter à votre tableau de bord pour voir plus de détails et traiter la commande.</p>
      </div>
      <div class="footer">
      </div>
    </div>
  </body>
  </html>
`;

          await sendEmail(adminEmail, "Nouvelle commande reçue", emailBody);

          const customerEmailBody = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  background-color: #1b1b1b;
                  color: #eaeaea;
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #2a2a2a;
                  border-radius: 10px;
                }
                .header {
                  text-align: center;
                  padding: 20px 0;
                }
                .header img {
                  width: 150px;
                  height: auto;
                }
                .content {
                  padding: 20px;
                  line-height: 1.6;
                }
                h1 {
                  color: #ff007f;
                  text-align: center;
                  font-size: 24px;
                }
                p {
                  font-size: 16px;
                  margin: 10px 0;
                  color: #d4d4d4;
                }
                .button {
                  display: block;
                  text-align: center;
                  margin: 20px 0;
                }
                .button a {
                  background-color: #ff007f;
                  color: white;
                  padding: 10px 20px;
                  border-radius: 50px;
                  text-decoration: none;
                  font-size: 16px;
                }
                .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #777;
                }
                .footer a {
                  color: #ff007f;
                  text-decoration: none;
                }
                strong{
                color: #ff007f;
                }
                .white{
                color: white;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img src="https://i.ibb.co/JKJPZmp/avenue-mondaine-logo-mail.png" alt="Avenue Mondaine Logo">
                </div>
                <div class="content">
                  <h1>Merci pour votre commande !</h1>
                  <p>Bonjour <strong>${
                    session.metadata?.first_name
                  }</strong>,</p>
                  <p>Nous sommes ravis de vous informer que votre commande a bien été confirmée. Voici un récapitulatif de votre réservation :</p>
                  <ul>
                    <li class="white"><strong>Montant :</strong> ${
                      session.amount_total / 100
                    } €</li>
                    <li class="white"><strong>Événement :</strong> ${
                      session.metadata?.event_date
                    } à  ${session.metadata?.event_address}, ${
            session.metadata?.event_city
          }</li>
   
                    <li class="white"><strong>Type de service :</strong> ${
                      session.metadata?.service_type
                    }</li>
                  </ul>
                  <p>Nous vous contacterons sous peu pour finaliser les détails de votre événement. Nous vous remercions de votre confiance.</p>
                </div>
                <div class="footer">
                  <p>Si vous avez des questions, vous pouvez nous contacter à tout moment à <a href="mailto:contact@avenuemondaine.com">contact@avenuemondaine.com</a>.</p>
                  <p>&copy; 2024 Avenue Mondaine. Tous droits réservés.</p>
                </div>
              </div>
            </body>
            </html>
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
