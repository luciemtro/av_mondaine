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
    const queryParams = new URLSearchParams(
      Object.entries({
        totalFee: formData.totalFee?.toString() || "0",
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        eventAddress: formData.eventAddress || "",
        eventCity: formData.eventCity || "",
        eventPostalCode: formData.eventPostalCode || "",
        eventCountry: formData.eventCountry || "",
        eventDate: formData.eventDate || "",
        eventHour: formData.eventHour?.toString() || "",
        numberOfPeople: formData.numberOfPeople?.toString() || "0",
        serviceType: formData.serviceType || "",
        budget: formData.budget?.toString() || "0",
        comment: formData.comment || "",
        selectedArtists: JSON.stringify(selectedArtists),
      })
    ).toString();

    router.push(`/reservation/payment?${queryParams}`);
  };

  return (
    <div className="pt-28 flex justify-center flex-col summary-container">
      <h1 className="text-center text-xl golden-text">
        Récapitulatif de la réservation
      </h1>
      <div className="golden-border m-10 p-10 flex flex-col gap-4">
        <div>
          <p className="golden-text">Prénom :</p>
          <p>{formData.firstName}</p>
        </div>
        <div>
          <p className="golden-text">Nom :</p>
          <p>{formData.lastName}</p>
        </div>
        <div>
          <p className="golden-text">Email :</p>
          <p>{formData.email}</p>
        </div>
        <div>
          <p className="golden-text">Téléphone :</p>
          <p>{formData.phone}</p>
        </div>
        <div>
          <p className="golden-text">Adresse de l'événement :</p>
          <p>{formData.eventAddress}</p>
        </div>
        <div>
          <p className="golden-text">Ville de l'événement :</p>
          <p>{formData.eventCity}</p>
        </div>
        <div>
          <p className="golden-text">Code postal de l'événement :</p>
          <p>{formData.eventPostalCode}</p>
        </div>
        <div>
          <p className="golden-text">Pays de l'événement :</p>
          <p>{formData.eventCountry}</p>
        </div>
        <div>
          <p className="golden-text">Date de l'événement :</p>
          <p>{formData.eventDate}</p>
        </div>
        <div>
          <p className="golden-text">Heure de l'événement :</p>
          <p>{formData.eventHour}</p>
        </div>
        <div>
          <p className="golden-text">Nombre de personnes :</p>
          <p>{formData.numberOfPeople}</p>
        </div>
        <div>
          <p className="golden-text">Type de service :</p>
          <p>{formData.serviceType}</p>
        </div>
        <div>
          <p className="golden-text">Artistes sélectionnés :</p>
          <ul>
            {selectedArtists.map((artist: { id: number; pseudo: string }) => (
              <li key={artist.id} className="golden-text">
                {artist.pseudo}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="golden-text">Commentaire :</p>
          <p>{formData.comment || "Aucun commentaire"}</p>
        </div>
        <div>
          <p className="golden-text">Montant total :</p>
          <p>{formData.totalFee} €</p>
        </div>
        <button onClick={handlePayment} className="">
          Procéder au paiement
        </button>
      </div>
    </div>
  );
}
