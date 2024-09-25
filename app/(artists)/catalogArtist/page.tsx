"use client";
import { useEffect, useState } from "react";
import { Artist } from "@/app/types/artist.types";
import Link from "next/link";

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
    <section className="catalog">
      <h1>Catalogue des Artistes</h1>
      {artists.length === 0 ? (
        <p>Chargement des artistes...</p> // Message de chargement
      ) : (
        <ul>
          {artists.map((artist: Artist) => (
            <Link href={`/artist/${artist.id}`} key={artist.id}>
              <li>
                <h2>{artist.pseudo}</h2>
                <p>{artist.title}</p>
                <p>
                  {artist.city}, {artist.country}
                </p>
                <p>{artist.description}</p>
                {artist.picture_one && (
                  <img
                    src={artist.picture_one}
                    alt={`${artist.pseudo} - ${artist.title}`}
                    style={{ width: "200px", height: "auto" }} // Tu peux ajuster la taille ici
                  />
                )}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </section>
  );
}
