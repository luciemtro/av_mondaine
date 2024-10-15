"use client";

import { useEffect, useState, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

// Charger Stripe avec ta clé publique
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PaymentPage() {
  const [stripe, setStripe] = useState<any>(null);

  // Charger l'instance Stripe
  useEffect(() => {
    async function load() {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    }
    load();
  }, []);

  const handlePayment = async (formData: any) => {
    if (!stripe) return;

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

    // Créer une session de paiement sur ton serveur
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalFee: formData.totalFee,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        eventAddress: formData.eventAddress || "",
        eventCity: formData.eventCity || "",
        eventPostalCode: formData.eventPostalCode || "",
        eventCountry: formData.eventCountry || "",
        eventDate: formData.eventDate || "",
        eventHour: formData.eventHour || "",
        numberOfPeople: formData.numberOfPeople || "0",
        serviceType: formData.serviceType || "",
        budget: formData.budget || "0",
        comment: formData.comment || "",
        selectedArtists: selectedArtists,
      }),
    });

    const { sessionId } = await res.json();

    // Rediriger l'utilisateur vers Stripe Checkout
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <Suspense fallback={<div>Chargement des informations de paiement...</div>}>
      <PaymentContent onPayment={handlePayment} />
    </Suspense>
  );
}

// Contenu de la page de paiement encapsulé dans Suspense
function PaymentContent({ onPayment }: { onPayment: (formData: any) => void }) {
  const searchParams = useSearchParams();
  const formData = Object.fromEntries(searchParams.entries());

  return (
    <div className="pt-28 payment-container flex flex-col justify-center items-center">
      <p className="text-2xl p-5 golden-text">
        Montant total à payer: {formData.totalFee} €
      </p>
      <button onClick={() => onPayment(formData)}>Passer au paiement</button>
    </div>
  );
}
