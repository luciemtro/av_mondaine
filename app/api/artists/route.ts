import { getConnection } from "@/app/lib/db"; // Utilise le pool de connexions
import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Artist } from "@/app/types/artist.types";

//Fonction pour ajouter un artiste
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

//Fonction pour récupérer tous les artistes
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

// Fonction pour modifier un artiste
export async function PUT(req: Request) {
  let connection;
  try {
    const body = await req.json();
    const {
      id,
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

    if (!id || !pseudo || !weight || !height || !city || !country || !title) {
      return NextResponse.json(
        { error: "Veuillez fournir toutes les informations nécessaires" },
        { status: 400 }
      );
    }

    // Obtenir une connexion à la base de données
    connection = await getConnection();

    const updateArtistSql = `
      UPDATE artists
      SET pseudo = ?, weight = ?, height = ?, city = ?, country = ?, title = ?, description = ?, picture_one = ?, picture_two = ?, picture_three = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute<ResultSetHeader>(
      updateArtistSql,
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
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Artiste non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Artiste modifié avec succès" });
  } catch (error) {
    console.error("Erreur lors de la modification de l'artiste :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Fonction pour supprimer un artiste
export async function DELETE(req: Request) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de l'artiste requis" },
        { status: 400 }
      );
    }

    // Obtenir une connexion à la base de données
    connection = await getConnection();

    const deleteArtistSql = `DELETE FROM artists WHERE id = ?`;

    const [result] = await connection.execute<ResultSetHeader>(
      deleteArtistSql,
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Artiste non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Artiste supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'artiste :", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
