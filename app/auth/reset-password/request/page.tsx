"use client";
import { useState } from "react";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Erreur reçue :", errorData);
        setMessage(`Erreur: ${errorData}`);
        return;
      }

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
      setMessage("Une erreur est survenue.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <h1>Mot de passe oublié</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse email"
        required
      />
      <button type="submit">Envoyer</button>
      {message && <p>{message}</p>}
    </form>
  );
}
