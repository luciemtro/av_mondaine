import { getConnection } from "@/app/lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import { Artist } from "@/app/types/artist.types";

// Fonction pour récupérer un artiste par son ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  let connection;
  const { id } = params;

  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return NextResponse.json(
        { error: "ID de l'artiste requis" },
        { status: 400 }
      );
    }

    // Obtenir une connexion depuis le pool
    connection = await getConnection();

    // Requête SQL pour obtenir un artiste par son ID
    const [artist] = await connection.query<Artist[] & RowDataPacket[]>(
      `SELECT id, pseudo, weight, height, city, country, title, description, picture_one, picture_two, picture_three, avatar1, avatar2
      FROM artists WHERE id = ?`,
      [id]
    );

    // Si aucun artiste n'est trouvé
    if (artist.length === 0) {
      return NextResponse.json(
        { error: "Artiste non trouvé" },
        { status: 404 }
      );
    }

    // Retourner l'artiste trouvé
    return NextResponse.json({ artist: artist[0] });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'artiste :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release(); // Relâcher la connexion
    }
  }
}
