import { getConnection } from "@/app/lib/db"; // Utilise le pool de connexions
import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Artist } from "@/app/types/artist.types";

export async function POST(req: Request) {
  let connection;
  try {
    const body = await req.json();

    const {
      pseudo,
      weight,
      height,
      city,
      country,
      title,
      description = "",
      picture_one = "",
      picture_two = "",
      picture_three = "",
    } = body;

    if (!pseudo || !weight || !height || !city || !country || !title) {
      return NextResponse.json(
        { error: "Veuillez fournir les informations nécessaires" },
        { status: 400 }
      );
    }

    // Obtenir une connexion depuis le pool
    connection = await getConnection();

    const insertArtistSql = `
    INSERT INTO artists
    (pseudo, weight, height, city, country, title, description, picture_one, picture_two, picture_three)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute<ResultSetHeader>(
      insertArtistSql,
      [
        pseudo,
        weight,
        height,
        city,
        country,
        title,
        description,
        picture_one,
        picture_two,
        picture_three,
      ]
    );

    return NextResponse.json({
      message: "Artiste ajouté avec succès",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'artiste :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  } finally {
    // Relâcher la connexion dans le pool (et non pas la fermer)
    if (connection) {
      connection.release(); // Utiliser release() pour renvoyer la connexion au pool
    }
  }
}

export async function GET() {
  let connection;
  try {
    // Obtenir une connexion depuis le pool
    connection = await getConnection();

    // Exécuter la requête SQL
    const [artists] = await connection.query<Artist[] & RowDataPacket[]>(`
      SELECT id, pseudo, weight, height, city, country, title, description, picture_one, picture_two, picture_three
      FROM artists
    `);

    // Retourner les artistes
    return NextResponse.json({ artists });
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  } finally {
    // Relâcher la connexion dans le pool
    if (connection) {
      connection.release();
    }
  }
}
