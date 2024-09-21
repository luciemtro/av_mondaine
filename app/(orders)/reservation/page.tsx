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

  // Liste des pays prédéfinis, incluant la Suisse
  const countries = [
    { code: "FR", name: "France" },
    { code: "CH", name: "Suisse" },
    { code: "DE", name: "Allemagne" },
    { code: "BE", name: "Belgique" },
    { code: "LU", name: "Luxembourg" },
    { code: "IT", name: "Italie" },
    { code: "ES", name: "Espagne" },
    { code: "PORT", name: "Portugal" },
    { code: "NL", name: "Pays-Bas" },
    // Ajoute d'autres pays ici
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: email, // Pré-remplir avec l'email de la session ou une chaîne vide
    phone: "",
    eventAddress: "",
    eventCity: "",
    eventPostalCode: "",
    eventCountry: "France",
    eventDate: "",
    eventHour: "" as string | null,
    numberOfPeople: 0,
    serviceType: "",
    budget: 0,
    comment: "",
  });
  const [totalFee, setTotalFee] = useState<number>(0);
  const router = useRouter();

  // Calcul du prix par artiste en fonction du pays sélectionné
  useEffect(() => {
    const feePerArtist = formData.eventCountry === "Suisse" ? 200 : 100; // Si le pays est Suisse, 200, sinon 100
    const totalFees = selectedArtists.length * feePerArtist;
    setTotalFee(totalFees);
  }, [formData.eventCountry, selectedArtists]);

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

  // Calculer le prix total basé sur le pays sélectionné et le nombre d'artistes
  useEffect(() => {
    const feePerArtist = formData.eventCountry === "Suisse" ? 200 : 100; // 200€ pour la Suisse, 100€ pour les autres
    const totalFees = selectedArtists.length * feePerArtist;
    setTotalFee(totalFees);
  }, [formData.eventCountry, selectedArtists]);

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
        totalFee: totalFee.toString(), // Le totalFee est déjà calculé côté frontend
        selectedArtists: JSON.stringify(selectedArtists), // JSON.stringify pour envoyer les artistes
      }).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Convertir tout en string pour l'URL
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    router.push(`/reservation/summary?${queryParams}`);
  };
  useEffect(() => {
    console.log("Données du formulaire mises à jour :", formData);
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} className="mt-28">
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
      {/* Sélection du pays */}
      <select
        value={formData.eventCountry}
        onChange={(e) =>
          setFormData({ ...formData, eventCountry: e.target.value })
        }
        required
      >
        {countries.map((country) => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
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
        value={formData.eventHour || ""} // Utilise une chaîne vide si 'null'
        onChange={(e) => {
          console.log("Heure sélectionnée :", e.target.value); // Afficher l'heure sélectionnée
          setFormData({ ...formData, eventHour: e.target.value });
        }}
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
      <select
        value={formData.serviceType}
        onChange={(e) =>
          setFormData({ ...formData, serviceType: e.target.value })
        }
        required
      >
        <option value="" disabled>
          Sélectionner un type de service
        </option>
        <option value="striptease">Striptease</option>
        <option value="spectacle_femme">Spectacle Only femme</option>
      </select>
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
