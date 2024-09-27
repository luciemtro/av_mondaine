"use client";
import { useEffect, useState } from "react";
import { Artist } from "@/app/types/artist.types";
import Link from "next/link";
import styles from "@/app/styles/catalogue.module.scss";

export default function CatalogArtist() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les artistes
    async function getArtists() {
      try {
        const response = await fetch("/api/artists", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des artistes.");
        }

        const data = await response.json();
        setArtists(data.artists); // Mettre à jour l'état avec les artistes
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    }

    getArtists(); // Appel à l'API pour récupérer les artistes
  }, []);

  if (error) {
    return <div>Erreur : {error}</div>; // Afficher l'erreur s'il y en a une
  }

  return (
    <section className="text-center catalog-artist-container pb-16">
      <h1 className="uppercase font-semibold p-5 pt-28">
        Catalogue de nos artistes
      </h1>
      {artists.length === 0 ? (
        <p>Chargement des artistes...</p> // Message de chargement
      ) : (
        <ul className="flex flex-wrap gap-5 justify-center">
          {artists.map((artist: Artist) => (
            <li className={styles.artistCard} key={artist.id}>
              {/* Le bouton Link positionné au-dessus du h2 */}
              <Link href={`/catalogArtist/${artist.id}`} passHref>
                <button className={`${styles.viewProfileButton}`}>
                  Voir Profil
                </button>
              </Link>
              {artist.picture_one && (
                <img
                  src={artist.picture_one}
                  alt={`${artist.pseudo} - ${artist.title}`}
                />
              )}
              <h2 className="z-10 uppercase font-bold">{artist.pseudo}</h2>
              <p className="z-10">{artist.title}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
