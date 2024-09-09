"use client";

import { useEffect, useState } from "react";

//Création d'un type pour typer les artistes
type Artist = {
  id: number;
  pseudo: string;
  weight: number;
  height: number;
  city: string;
  country: string;
  title: string;
  description: string;
  picture_one: string;
  picture_two: string;
  picture_three: string;
};

export default function ReservationForm() {
  // Utilisation du type Artist pour typer l'état qui contient les artistes
  const [artists, setArtists] = useState<Artist[]>([]);

  // Utilisation de useState pour gérer les artistes sélectionnés, les données du formulaire et les frais totaux
  const [selectedArtists, setSelectedArtists] = useState<number[]>([]);

  // Utilisation de useState pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventAddress: "",
    eventCity: "",
    eventPostalCode: "",
    eventCountry: "",
    eventDate: "",
    numberOfPeople: 0,
    serviceType: "",
    budget: 0,
    comment: "",
  });

  // Utilisation de useState pour gérer les frais totaux
  const [totalFee, setTotalFee] = useState<number>(0);

  // Récupérer les artistes depuis l'API et typer la réponse
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

  // Calcul des frais pour les artistes sélectionnés (ex. basé sur une logique personnalisée)
  useEffect(() => {
    const fees = selectedArtists.reduce((acc, artistId) => {
      const artist = artists.find((artist) => artist.id === artistId);
      return artist ? acc + 100 /* Exemple de tarif fixe */ : acc;
    }, 0);
    setTotalFee(fees);
  }, [selectedArtists, artists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        selectedArtists,
        totalFee,
      }),
    });

    if (response.ok) {
      alert("Commande créée avec succès !");
    } else {
      alert("Erreur lors de la création de la commande");
    }
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
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
        placeholder="Code postal"
        value={formData.eventPostalCode}
        onChange={(e) =>
          setFormData({ ...formData, eventPostalCode: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Pays"
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
        type="number"
        placeholder="Nombre de personnes"
        value={formData.numberOfPeople}
        onChange={(e) =>
          setFormData({ ...formData, numberOfPeople: parseInt(e.target.value) })
        }
      />
      <input
        type="text"
        placeholder="Type de prestation"
        value={formData.serviceType}
        onChange={(e) =>
          setFormData({ ...formData, serviceType: e.target.value })
        }
      />
      <textarea
        placeholder="Commentaires"
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
}
