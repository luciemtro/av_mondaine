"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Summary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formData = Object.fromEntries(searchParams.entries());

  // Décoder les artistes sélectionnés depuis la chaîne JSON
  const selectedArtists = formData.selectedArtists
    ? JSON.parse(formData.selectedArtists)
    : [];

  const handlePayment = () => {
    // Assurer que toutes les données sont converties en chaînes de caractères et qu'il n'y a pas de valeurs undefined ou null
    const queryParams = new URLSearchParams(
      Object.entries({
        totalFee: formData.totalFee?.toString() || "0", // Assurer que totalFee est bien une chaîne
        firstName: formData.firstName || "", // Valeur par défaut si manquant
        lastName: formData.lastName || "", // Valeur par défaut
        email: formData.email || "", // Valeur par défaut
        phone: formData.phone || "", // Valeur par défaut
        eventAddress: formData.eventAddress || "", // Valeur par défaut
        eventCity: formData.eventCity || "", // Valeur par défaut
        eventPostalCode: formData.eventPostalCode || "", // Valeur par défaut
        eventCountry: formData.eventCountry || "", // Valeur par défaut
        eventDate: formData.eventDate || "", // Valeur par défaut
        eventHour: formData.eventHour?.toString() || "", // Valeur par
        numberOfPeople: formData.numberOfPeople?.toString() || "0", // Conversion en chaîne de caractères
        serviceType: formData.serviceType || "", // Valeur par défaut
        budget: formData.budget?.toString() || "0", // Conversion en chaîne de caractères
        comment: formData.comment || "", // Valeur par défaut
        selectedArtists: JSON.stringify(selectedArtists), // Sérialiser en JSON
      })
    ).toString();

    // Rediriger vers la page de paiement avec les query parameters encodés
    router.push(`/reservation/payment?${queryParams}`);
  };

  return (
    <div className="mt-28">
      <h1>Récapitulatif de la réservation</h1>
      <p>Prénom: {formData.firstName}</p>
      <p>Nom: {formData.lastName}</p>
      <p>Email: {formData.email}</p>
      <p>Téléphone: {formData.phone}</p>
      <p>Adresse de l'événement: {formData.eventAddress}</p>
      <p>Ville de l'événement: {formData.eventCity}</p>
      <p>Code postal de l'événement: {formData.eventPostalCode}</p>
      <p>Pays de l'événement: {formData.eventCountry}</p>
      <p>Date de l'événement: {formData.eventDate}</p>
      <p>Heure de l'événemment: {formData.eventHour}</p>
      <p>Nombre de personnes: {formData.numberOfPeople}</p>
      <p>Type de service: {formData.serviceType}</p>
      <h3>Artistes sélectionnés :</h3>
      <ul>
        {selectedArtists.map((artist: { id: number; pseudo: string }) => (
          <li key={artist.id}>{artist.pseudo}</li>
        ))}
      </ul>
      <p>Montant total: {formData.totalFee} €</p>
      <button onClick={handlePayment}>Procéder au paiement</button>
    </div>
  );
}
