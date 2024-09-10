// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  // Récupérer toutes les informations envoyées depuis le frontend
  const {
    totalFee,
    firstName,
    lastName,
    email,
    phone,
    eventAddress,
    eventCity,
    eventPostalCode,
    eventCountry,
    eventDate,
    numberOfPeople,
    serviceType,
    budget,
    comment,
    selectedArtists, // Artistes sélectionnés
  } = await req.json();

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
      customer_email: email,
      metadata: {
        first_name: firstName || "", // Ajouter des valeurs par défaut
        last_name: lastName || "",
        email: email || "",
        phone: phone || "",
        event_address: eventAddress || "",
        event_city: eventCity || "",
        event_postal_code: eventPostalCode || "",
        event_country: eventCountry || "",
        event_date: eventDate || "",
        number_of_people: numberOfPeople?.toString() || "0", // Convertir en chaîne
        service_type: serviceType || "",
        budget: budget?.toString() || "0",
        comment: comment || "",
        selected_artists: JSON.stringify(selectedArtists || []), // Convertir les artistes sélectionnés en JSON
      },
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
