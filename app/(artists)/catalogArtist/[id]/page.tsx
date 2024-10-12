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
  const [currentImage, setCurrentImage] = useState<string | null>(null); // État pour l'image affichée
  const [isFading, setIsFading] = useState<boolean>(false); // État pour la transition d'opacité

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
        setCurrentImage(data.artist.picture_two); // Définir l'image par défaut (picture_two)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    }

    if (id) {
      getArtist(); // Appel à l'API pour récupérer l'artiste si l'ID est défini
    }
  }, [id]);

  const handleAvatarClick = (image: string) => {
    setIsFading(true); // Démarre la transition de fondu

    setTimeout(() => {
      setCurrentImage(image); // Change l'image après la fin du fondu
      setIsFading(false); // Termine la transition
    }, 300); // Le délai doit correspondre à la durée de la transition CSS
  };

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!artist) {
    return <div>Chargement de l'artiste...</div>;
  }

  return (
    <section className={`${styles.artistPageContainer} relative p-28`}>
      {/* Conteneur global pour les deux sections */}
      <Link href="/catalogArtist">
        <button className="m-5">Retour</button>
      </Link>
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
          <img
            src={currentImage || artist.picture_two} // Affiche l'image courante
            alt={`Image de ${artist.pseudo}`}
            className={`${styles.artistImage} ${
              isFading ? styles.fadeOut : styles.fadeIn
            }`} // Ajout de la classe d'animation
          />
        </div>
      </div>
      <div className={`${styles.artistAvatarContainer} flex`}>
        {/* Bouton de Réservation */}
        <Link href={`/reservation`} className={styles.artistButtonReservation}>
          <button>Réservez ici</button>
        </Link>

        <img
          src={artist.avatar1}
          alt={`Avatar de ${artist.pseudo}`}
          className={styles.artistAvatar}
          onClick={() => handleAvatarClick(artist.picture_two)} // Au clic sur avatar1
        />
        <img
          src={artist.avatar2}
          alt={`Avatar de ${artist.pseudo}`}
          className={styles.artistAvatar}
          onClick={() => handleAvatarClick(artist.picture_three)} // Au clic sur avatar2
        />
      </div>
      {/* Description */}

      <div className={`${styles.artistDetailsBox} ${styles.artistDescription}`}>
        <h2 className="font-semibold text-center uppercase p-3">Description</h2>
        <p className="text-sm pb-3">{artist.description}</p>
      </div>
    </section>
  );
}
