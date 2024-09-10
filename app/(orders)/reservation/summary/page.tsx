// app/reservation/summary/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Summary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formData = Object.fromEntries(searchParams.entries());

  const selectedArtists = (formData.selectedArtists as string)
    .split(",")
    .map(Number); // Reconvertir les artistes sélectionnés en tableau de nombres

  const handlePayment = () => {
    // Convertir les données en chaînes de caractères
    const queryParams = new URLSearchParams(
      Object.entries({
        totalFee: formData.totalFee.toString(), // Convertir en chaîne
        ...Object.fromEntries(
          Object.entries(formData).map(([key, value]) => [key, String(value)]) // Convertir toutes les valeurs en chaînes
        ),
      })
    ).toString();

    // Rediriger vers la page de paiement avec les query parameters encodés
    router.push(`/reservation/payment?${queryParams}`);
  };

  return (
    <div>
      <h1>Récapitulatif de la réservation</h1>
      <p>Prénom: {formData.firstName}</p>
      <p>Nom: {formData.lastName}</p>
      <p>Email: {formData.email}</p>
      <p>Montant total: {formData.totalFee} €</p>
      <h3>Artistes sélectionnés : {selectedArtists.join(", ")}</h3>
      <button onClick={handlePayment}>Procéder au paiement</button>
    </div>
  );
}
