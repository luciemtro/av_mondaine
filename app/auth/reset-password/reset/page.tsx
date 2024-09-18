"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Utiliser le bon hook pour router et searchParams

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Utiliser useRouter pour la redirection
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Récupérer le token depuis l'URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/reset-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);

    // Rediriger vers la page de connexion avec l'email (si disponible) après succès
    if (res.ok && data.email) {
      router.push(`/auth/login?email=${encodeURIComponent(data.email)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <h1>Réinitialiser le mot de passe</h1>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
        required
      />
      <button type="submit">Réinitialiser</button>
      {message && <p>{message}</p>}
    </form>
  );
}
