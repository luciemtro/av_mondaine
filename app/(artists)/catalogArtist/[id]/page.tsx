// catalogArtist/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Artist } from "@/app/types/artist.types";
import styles from "@/app/styles/catalogue.module.scss";

export default function ArtistPage() {
  const { id } = useParams(); // Récupère l'ID de l'artiste depuis l'URL
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les détails de l'artiste
    async function getArtist() {
      try {
        const response = await fetch(`/api/catalogArtist/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'artiste.");
        }

        const data = await response.json();
        setArtist(data.artist); // Mettre à jour l'état avec les détails de l'artiste
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    }

    if (id) {
      getArtist(); // Appel à l'API pour récupérer l'artiste si l'ID est défini
    }
  }, [id]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!artist) {
    return <div>Chargement de l'artiste...</div>;
  }

  return (
    <section className="artist-page-container p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold uppercase">{artist.pseudo}</h1>
        <p className="text-xl italic">{artist.title}</p>
        {artist.picture_one && (
          <img
            className={styles.artistImage}
            src={artist.picture_one}
            alt={artist.pseudo}
          />
        )}
      </div>

      <div className="artist-details mt-5">
        <h2 className="font-semibold">Description</h2>
        <p>{artist.description}</p>

        {/* Ajouter plus d'informations sur l'artiste ici */}
      </div>
    </section>
  );
}
