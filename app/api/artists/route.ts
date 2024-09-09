//Importe la fonction createConnection du fichier db.js qui sert à se connecter à la base de données
import { createConnection } from "../../lib/db";
//Importe la fonction NextResponse de next/server qui permet de renvoyer une réponse au client
import { NextResponse } from "next/server";

/**Méthode GET, elle permet de récupérer tous les artistes de la base de données
1° createConnection est la méthode qu'on a crée pour se connecter à la base de données, on l'appelle avec await pour attendre la connexion.
2° On stock la requête SQL dans la variable sql pour récupérer tous les artistes.
3° On utilise la méthode prédéfini de next, "NextResponse.json" qui sert à convertir les données en Json pour les renvoyer au client.
4¨° En cas d'erreur, elle renvoie une erreur 500 avec le message d'erreur */

export async function GET() {
  try {
    const db = await createConnection(); // Crée une connexion à la base de données
    const sql = "SELECT * FROM artists"; // Requête SQL pour récupérer tous les artistes
    const [artists] = await db.query(sql); // Exécute la requête SQL et stocke les données dans la variable artists
    return NextResponse.json({ artists }); // Convertit les données en JSON et les renvoie au client
  } catch (error) {
    console.log(error);

    // Vérification si l'erreur est une instance de Error avant d'accéder à .message
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Si ce n'est pas une erreur de type Error, on renvoie un message générique
      return NextResponse.json(
        { error: "Erreur lors de la récupération des artistes" },
        { status: 500 }
      );
    }
  }
}
