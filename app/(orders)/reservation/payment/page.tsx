// app/reservation/payment/page.tsx
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
  const { totalFee, firstName, lastName, email } = Object.fromEntries(
    searchParams.entries()
  );
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

    // Créer une session de paiement sur ton serveur
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalFee,
        firstName,
        lastName,
        email,
      }),
    });

    const { sessionId } = await res.json();

    // Rediriger l'utilisateur vers Stripe Checkout
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <div>
      <h1>Paiement</h1>
      <p>Montant total à payer: {totalFee} €</p>
      <button onClick={handlePayment}>Payer avec Stripe</button>
    </div>
  );
}
