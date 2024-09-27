"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Artist } from "@/app/types/artist.types";
import styles from "@/app/styles/singleArtist.module.scss";
import Link from "next/link";

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
    <section className={`${styles.artistPageContainer} pt-28`}>
      <div className={`${styles.artistSousContainer} flex `}>
        <div className={`${styles.artistDetailsContainer} flex justify-center`}>
          <div
            className={`${styles.artistDetails} .golden-border p-5 flex flex-col justify-center items-center `}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold uppercase">{artist.pseudo}</h1>
              <p className="text-xl italic p-3">{artist.title}</p>
              <p>
                {artist.country}, {artist.city}
              </p>
            </div>

            <h2 className="font-semibold text-center p-5 uppercase ">
              Description
            </h2>
            <p className="">{artist.description}</p>
            <div className="flex gap-3 justify-center p-5">
              <h2 className="font-semibold">Poids</h2>
              <p>{artist.weight} kg</p>
              <h2 className="font-semibold">Taille</h2>
              <p>{artist.height} cm</p>
            </div>
            <Link href={`/reservation`}>
              <button>Réservez</button>
            </Link>
          </div>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={40}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          className={`${styles.carousselContainer}`} // Ajout de la classe ici
        >
          {artist.picture_one && (
            <SwiperSlide>
              <div className={`${styles.imageContainer}`}>
                <img
                  className={styles.artistImage}
                  src={artist.picture_one}
                  alt={artist.pseudo}
                />
              </div>
            </SwiperSlide>
          )}
          {artist.picture_two && (
            <SwiperSlide>
              <div className={`${styles.imageContainer}`}>
                <img
                  className={styles.artistImage}
                  src={artist.picture_two}
                  alt={artist.pseudo}
                />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </section>
  );
}
