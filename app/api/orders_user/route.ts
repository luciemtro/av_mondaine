import { getConnection } from "@/app/lib/db"; // Utilise le pool de connexions
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { Order } from "@/app/types/order.types";
import { getServerSession } from "next-auth";
import { handler as authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth"; // Import du type Session

// Fonction pour récupérer uniquement les commandes de l'utilisateur connecté
export async function GET() {
  let connection;
  try {
    // Récupérer la session de l'utilisateur connecté
    const session: Session | null = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Obtenir une connexion à la base de données
    connection = await getConnection();

    // Requête pour récupérer les commandes de l'utilisateur connecté
    const query = `
      SELECT 
        o.id, 
        o.first_name, 
        o.last_name, 
        o.email, 
        o.phone, 
        o.event_address, 
        o.event_city, 
        o.event_postal_code, 
        o.event_country, 
        o.event_date, 
        o.event_hour,
        o.number_of_people, 
        o.service_type, 
        o.budget, 
        o.comment, 
        o.total_fee, 
        o.created_at,
        GROUP_CONCAT(a.pseudo) AS artists
      FROM orders o
      LEFT JOIN order_artists oa ON o.id = oa.order_id
      LEFT JOIN artists a ON oa.artist_id = a.id
      WHERE o.email = ? -- Filtrer les commandes par l'email de l'utilisateur connecté
      GROUP BY o.id
      ORDER BY o.id DESC
    `;

    // Exécuter la requête en utilisant l'email de l'utilisateur connecté
    const [orders] = await connection.query<Order[] & RowDataPacket[]>(query, [
      userEmail,
    ]);

    // Retourner les commandes au format JSON
    return NextResponse.json({ orders });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes de l'utilisateur :",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes." },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
