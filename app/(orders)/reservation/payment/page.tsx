"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

// Charger Stripe avec ta clé publique
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const formData = Object.fromEntries(searchParams.entries());

  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    }
    load();
  }, []);

  const handlePayment = async () => {
    if (!stripe) return;

    // Vérifier si formData.selectedArtists est déjà un objet ou une chaîne JSON
    // Désérialiser les artistes sélectionnés
    let selectedArtists = [];
    try {
      selectedArtists = formData.selectedArtists
        ? JSON.parse(formData.selectedArtists)
        : [];
    } catch (error) {
      console.error(
        "Erreur lors de la conversion des artistes sélectionnés :",
        error
      );
      return;
    }

    console.log(
      "Artistes sélectionnés (avant envoi à Stripe) :",
      selectedArtists
    );

    // Créer une session de paiement sur ton serveur
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalFee: formData.totalFee,
        firstName: formData.firstName || "", // Assurer que les champs existent
        lastName: formData.lastName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        eventAddress: formData.eventAddress || "",
        eventCity: formData.eventCity || "",
        eventPostalCode: formData.eventPostalCode || "",
        eventCountry: formData.eventCountry || "",
        eventDate: formData.eventDate || "",
        eventHour: formData.eventHour || "", // Assurer que l'heure est bien une chaîne
        numberOfPeople: formData.numberOfPeople || "0",
        serviceType: formData.serviceType || "",
        budget: formData.budget || "0",
        comment: formData.comment || "",
        selectedArtists: selectedArtists, // Envoyer le tableau d'artistes
      }),
    });

    const { sessionId } = await res.json();

    // Rediriger l'utilisateur vers Stripe Checkout
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <div className="pt-28 payment-container flex flex-col justify-center items-center">
      <p className="text-2xl p-5 golden-text">
        Montant total à payer: {formData.totalFee} €
      </p>
      <button onClick={handlePayment}>Passer au paiement</button>
    </div>
  );
}
