"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Artist } from "@/app/types/artist.types";
import styles from "@/app/styles/singleArtist.module.scss";
import Link from "next/link";

export default function ArtistPage() {
  const { id } = useParams(); // Récupère l'ID de l'artiste depuis l'URL
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    <section className={`${styles.artistPageContainer} relative p-28`}>
      {/* Conteneur global pour les deux sections */}
      <div className={styles.mainContentContainer}>
        {/* Conteneur regroupant le Pseudo, Localisation et Détails */}
        <div className={styles.artistInfoContainer}>
          {/* Pseudo */}
          <div
            className={`${styles.artistDetailsBox} ${styles.artistPseudo} flex flex-col items-center justify-center`}
          >
            <h1 className="text-lg font-bold uppercase">{artist.pseudo}</h1>
            <p className="text-sm italic p-2 text-center">{artist.title}</p>
          </div>

          {/* Localisation */}
          <div
            className={`${styles.artistDetailsBox} ${styles.artistLocalisation} flex flex-col items-center justify-center`}
          >
            <h2 className="font-semibold text-center uppercase text-sm">
              Localisation
            </h2>
            <p className="text-xs">
              {artist.city}, {artist.country}
            </p>
          </div>

          {/* Détails */}
          <div
            className={`${styles.artistDetailsBox} ${styles.artistDetails} flex flex-col items-center justify-center`}
          >
            <h2 className="font-semibold text-center uppercase text-sm">
              Détails
            </h2>
            <div className="flex gap-2 justify-center">
              <div>
                <h3 className="font-semibold text-sm">Poids</h3>
                <p className="text-sm">{artist.weight} kg</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Taille</h3>
                <p className="text-sm">{artist.height} cm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteneur de l'image de l'artiste */}
        <div className={styles.artistImageContainer}>
          {/* Bouton de Réservation */}
          <Link
            href={`/reservation`}
            className={styles.artistButtonReservation}
          >
            <button>Réservez</button>
          </Link>
          <img
            src={artist.picture_one}
            alt={`Image de ${artist.pseudo}`}
            className={styles.artistImage}
          />
        </div>
      </div>

      {/* Description */}
      <div className={`${styles.artistDetailsBox} ${styles.artistDescription}`}>
        <h2 className="font-semibold text-center uppercase p-3">Description</h2>
        <p className="text-sm">{artist.description}</p>
      </div>
    </section>
  );
}
