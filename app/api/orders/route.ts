import { getConnection } from "@/app/lib/db"; // Utilise le pool de connexions
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();

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

    // Obtenir une connexion depuis le pool
    connection = await getConnection();

    // Commencer une transaction
    await connection.beginTransaction();

    // Insertion de la commande dans la table orders
    const insertOrderSql = `
      INSERT INTO orders 
      (first_name, last_name, email, phone, event_address, event_city, event_postal_code, event_country, event_date, number_of_people, service_type, budget, comment, total_fee) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Exécution de l'insertion de la commande
    const [result] = await connection.execute<ResultSetHeader>(insertOrderSql, [
      firstName,
      lastName,
      email,
      phone || "N/A",
      eventAddress || "Non précisée",
      eventCity || "Ville non précisée",
      eventPostalCode || "00000",
      eventCountry || "Pays non précisé",
      eventDate,
      numberOfPeople || 1,
      serviceType || "Non précisée",
      budget || 0.0,
      comment || "",
      totalFee,
    ]);

    // Récupérer l'ID de la commande insérée
    const orderId = result.insertId;

    // Associer les artistes à la commande dans la table order_artists
    const insertOrderArtistSql = `
      INSERT INTO order_artists (order_id, artist_id) VALUES (?, ?)
    `;

    for (const artistId of selectedArtists) {
      console.log(`Associer l'artiste ${artistId} avec la commande ${orderId}`);
      await connection.execute(insertOrderArtistSql, [orderId, artistId]);
    }

    // Valider la transaction si tout s'est bien passé
    await connection.commit();

    // Relâcher la connexion au pool (ne pas utiliser end())
    connection.release();

    return NextResponse.json({
      message: "Commande créée avec succès",
      orderId,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);

    if (connection) {
      await connection.rollback(); // Annuler la transaction
      connection.release(); // Relâcher la connexion au pool, même en cas d'erreur
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
