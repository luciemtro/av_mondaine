import { createConnection } from "../../lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  let db;
  try {
    const body = await req.json();
    console.log("Données reçues :", body);

    const {
      firstName,
      lastName,
      email,
      phone,
      eventAddress,
      eventCity,
      eventPostalCode,
      eventCountry,
      eventDate,
      numberOfPeople,
      serviceType,
      budget,
      comment,
      totalFee,
      selectedArtists, // Liste des artistes sélectionnés
    } = body;

    // Vérification des données obligatoires
    if (
      !firstName ||
      !lastName ||
      !email ||
      !eventAddress ||
      !eventDate ||
      !totalFee ||
      !selectedArtists ||
      selectedArtists.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Certaines données obligatoires sont manquantes ou aucun artiste sélectionné",
        },
        { status: 400 }
      );
    }

    // Connexion à la base de données
    db = await createConnection();
    console.log("Connexion à la base de données réussie.");

    // Commencer une transaction
    await db.beginTransaction();

    // Insertion de la commande dans la table orders
    const insertOrderSql = `
      INSERT INTO orders 
      (first_name, last_name, email, phone, event_address, event_city, event_postal_code, event_country, event_date, number_of_people, service_type, budget, comment, total_fee) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    console.log("Requête SQL :", insertOrderSql);

    // Exécution de l'insertion de la commande
    const [result] = await db.execute<ResultSetHeader>(insertOrderSql, [
      firstName, // 1ère valeur
      lastName, // 2ème valeur
      email, // 3ème valeur
      phone || "N/A", // 4ème valeur avec valeur par défaut
      eventAddress || "Non précisée", // 5ème valeur avec valeur par défaut
      eventCity || "Ville non précisée", // 6ème valeur avec valeur par défaut
      eventPostalCode || "00000", // 7ème valeur avec valeur par défaut
      eventCountry || "Pays non précisé", // 8ème valeur avec valeur par défaut
      eventDate, // 9ème valeur
      numberOfPeople || 1, // 10ème valeur (par défaut 1 personne si non fourni)
      serviceType || "Non précisée", // 11ème valeur avec valeur par défaut
      budget || 0.0, // 12ème valeur avec valeur par défaut
      comment || "", // 13ème valeur avec valeur par défaut
      totalFee, // 14ème valeur (obligatoire)
    ]);
    console.log("Résultat de l'insertion de la commande :", result);

    // Récupérer l'ID de la commande insérée
    const orderId = result.insertId;
    console.log("Order ID:", orderId);

    // Associer les artistes à la commande dans la table order_artists
    const insertOrderArtistSql = `
      INSERT INTO order_artists (order_id, artist_id) VALUES (?, ?)
    `;

    for (const artistId of selectedArtists) {
      console.log(`Associer l'artiste ${artistId} avec la commande ${orderId}`);
      await db.execute(insertOrderArtistSql, [orderId, artistId]); // Assurer que chaque artiste est associé
    }

    // Valider la transaction si tout s'est bien passé
    await db.commit();

    // Fermer la connexion à la base de données après toutes les opérations
    await db.end();

    return NextResponse.json({
      message: "Commande créée avec succès",
      orderId,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);

    // Si une erreur survient, annuler la transaction et fermer la connexion
    if (db) {
      await db.rollback(); // Annuler la transaction
      await db.end(); // Fermer la connexion
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Erreur inconnue" }, { status: 500 });
    }
  }
}
