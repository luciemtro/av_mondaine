import React from "react";
import { useEffect, useState } from "react";
import { Artist } from "@/app/types/artist.types";

type Props = {
  params: {
    id: number;
  };
};

export default async function handler({ params }: Props) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les artistes via l'API
    async function fetchArtists() {
      try {
        const response = await fetch("/api/artists/${id}");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des artistes.");
        }
        const data = await response.json();
        setArtists(data.artists); // Stocke les artistes dans l'état
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Stocker le message d'erreur
        } else {
          setError("Erreur inconnue.");
        }
      }
    }

    fetchArtists();
  }, []);

  if (error) {
    return <div>Erreur : {error}</div>; // Affiche l'erreur si elle existe
  }

  return (
    <div>
      <h1>Artist {params.id}</h1>
    </div>
  );
}
