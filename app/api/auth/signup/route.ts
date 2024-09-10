// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

// Types pour la création de l'utilisateur
interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  role: "user" | "admin";
}

export async function POST(request: Request) {
  const {
    email,
    password,
    role = "user", // Si aucun rôle n'est fourni, par défaut "user"
  }: { email: string; password: string; role?: string } = await request.json();

  const connection = await getConnection();

  try {
    // Vérifier si l'email existe déjà
    const [existingUsers] = await connection.execute<User[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "Email already in use!" },
        { status: 400 }
      );
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer le nouvel utilisateur dans la base de données
    await connection.execute(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role]
    );

    return NextResponse.json(
      { message: "User created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
