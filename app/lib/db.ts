// lib/db.ts
import mysql, { Connection } from "mysql2/promise";

let connection: Connection | null = null;
/** En typescript, on peut définir le type d'une variable avec le symbole ":",
 * ici on définit le type de la variable connection en Connection | null, soit c'est une instance de connexion soit c'est null
 * La fonction createConnexion permet de créer une connexion à la base de données
 * Elle prend en paramètre les informations de connexion à la base de données (Dans le fichier .env que l'on a fait avec les Keys values)
 * Puis elle retourne la connexion
 * Si la connexion n'existe pas, elle crée une connexion à la base de données */

export const createConnection = async (): Promise<Connection> => {
  if (!connection) {
    //Si la connexion n'existe pas !connection
    connection = await mysql.createConnection({
      //Crée une connexion à la base de données, mysql. est une méthode de mysql2/promise
      //On type les variables, obligatoire avec TypeScript
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    });
  }
  return connection;
};
