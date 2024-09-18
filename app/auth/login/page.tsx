// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false, // Désactiver la redirection automatique
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      // Récupérer la session après la connexion pour obtenir le rôle
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      // Debugging : Affiche le rôle dans la console
      console.log("User Role:", session?.user?.role);

      // Vérifier le rôle et rediriger vers le bon dashboard
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard"); // Rediriger vers le dashboard admin
      } else {
        router.push("/"); // Rediriger vers le dashboard utilisateur
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
