"use client";

import { useEffect, useState } from "react";
import { Artist } from "@/app/types/artist.types";
import { useSession } from "next-auth/react"; // Import de useSession pour vérifier la session
import { useRouter } from "next/navigation";

const ReservationPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Si l'utilisateur n'est pas connecté, redirection vers la page de login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Utilisation de || "" pour garantir que l'email soit toujours une string
  const userEmail = session?.user?.email || "";

  return session && session.user ? <ReservationForm email={userEmail} /> : null;
};

interface ReservationFormProps {
  email?: string; // email est optionnel
}

const ReservationForm = ({ email = "" }: ReservationFormProps) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: email, // Pré-remplir avec l'email de la session ou une chaîne vide
    phone: "",
    eventAddress: "",
    eventCity: "",
    eventPostalCode: "",
    eventCountry: "",
    eventDate: "",
    eventHour: "",
    numberOfPeople: 0,
    serviceType: "",
    budget: 0,
    comment: "",
  });
  const [totalFee, setTotalFee] = useState<number>(0);
  const router = useRouter();

  // Récupérer les artistes depuis l'API
  useEffect(() => {
    async function fetchArtists() {
      const response = await fetch("/api/artists");
      const data = await response.json();
      setArtists(data.artists as Artist[]);
    }
    fetchArtists();
  }, []);

  const handleArtistSelection = (id: number) => {
    setSelectedArtists((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((artistId) => artistId !== id)
        : [...prevSelected, id]
    );
  };

  // Calcul des frais pour les artistes sélectionnés
  useEffect(() => {
    const fees = selectedArtists.reduce((acc, artistId) => {
      const artist = artists.find((artist) => artist.id === artistId);
      return artist ? acc + 100 /* Exemple de tarif fixe */ : acc;
    }, 0);
    setTotalFee(fees);
  }, [selectedArtists, artists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedArtistsData = selectedArtists
      .map((id) => {
        const artist = artists.find((artist) => artist.id === id);
        return artist ? { id: artist.id, pseudo: artist.pseudo } : null;
      })
      .filter(Boolean); // Filtrer les artistes valides

    console.log("Artistes sélectionnés (avant envoi) :", selectedArtistsData); // Log des artistes sélectionnés

    const queryParams = new URLSearchParams(
      Object.entries({
        ...formData,
        totalFee: totalFee.toString(),
        // JSON.stringify les artistes sélectionnés pour l'envoyer sous forme de chaîne
        selectedArtists: JSON.stringify(selectedArtistsData),
      }).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Tout convertir en string pour URLSearchParams
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    router.push(`/reservation/summary?${queryParams}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Prénom"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Nom"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Adresse de l'événement"
        value={formData.eventAddress}
        onChange={(e) =>
          setFormData({ ...formData, eventAddress: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Ville de l'événement"
        value={formData.eventCity}
        onChange={(e) =>
          setFormData({ ...formData, eventCity: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Code postal de l'événement"
        value={formData.eventPostalCode}
        onChange={(e) =>
          setFormData({ ...formData, eventPostalCode: e.target.value })
        }
        required
      />
      <input
        type="text"
        placeholder="Pays de l'événement"
        value={formData.eventCountry}
        onChange={(e) =>
          setFormData({ ...formData, eventCountry: e.target.value })
        }
        required
      />
      <input
        type="date"
        placeholder="Date de l'événement"
        value={formData.eventDate}
        onChange={(e) =>
          setFormData({ ...formData, eventDate: e.target.value })
        }
        required
      />
      <input
        type="time"
        placeholder="Heure de l'événement"
        value={formData.eventHour}
        onChange={(e) =>
          setFormData({ ...formData, eventHour: e.target.value })
        }
        required
      />
      <input
        type="number"
        placeholder="Nombre de personnes"
        value={formData.numberOfPeople}
        onChange={(e) =>
          setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })
        }
        required
      />
      <input
        type="text"
        placeholder="Type de service"
        value={formData.serviceType}
        onChange={(e) =>
          setFormData({ ...formData, serviceType: e.target.value })
        }
        required
      />
      <input
        type="number"
        placeholder="Budget"
        value={formData.budget}
        onChange={(e) =>
          setFormData({ ...formData, budget: parseInt(e.target.value) })
        }
        required
      />
      <textarea
        placeholder="Commentaire"
        value={formData.comment}
        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
      />
      <h3>Sélectionnez les artistes</h3>
      <div>
        {artists.map((artist) => (
          <div key={artist.id}>
            <input
              type="checkbox"
              id={`artist-${artist.id}`}
              checked={selectedArtists.includes(artist.id)}
              onChange={() => handleArtistSelection(artist.id)}
            />
            <label htmlFor={`artist-${artist.id}`}>
              {artist.pseudo} ({artist.city}, {artist.country}) - {artist.title}
            </label>
          </div>
        ))}
      </div>

      <h3>Frais totaux : {totalFee} €</h3>

      <button type="submit">Réserver</button>
    </form>
  );
};

export default ReservationPage;
