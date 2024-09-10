// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const { totalFee, firstName, lastName, email } = await req.json();

  try {
    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Réservation d'événement",
            },
            unit_amount: Math.round(Number(totalFee) * 100), // Montant en centimes
          },
          quantity: 1,
        },
      ],
      customer_email: email, // Ajouter l'email pour le reçu Stripe
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/reservation/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/reservation/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe" },
      { status: 500 }
    );
  }
}
