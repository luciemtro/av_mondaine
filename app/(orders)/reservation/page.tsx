"use client";

import { useEffect, useState } from "react";
import { Artist } from "@/app/types/artist.types";
import { useSession } from "next-auth/react"; // Import de useSession pour vérifier la session
import { useRouter } from "next/navigation";
import styles from "@/app/styles/reservation.module.scss"; // Import du fichier CSS module

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

  const userEmail = session?.user?.email || "";

  return session && session.user ? <ReservationForm email={userEmail} /> : null;
};

interface ReservationFormProps {
  email?: string;
}

const ReservationForm = ({ email = "" }: ReservationFormProps) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<number[]>([]);

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
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: email,
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

  useEffect(() => {
    const feePerArtist = formData.eventCountry === "Suisse" ? 200 : 100;
    const totalFees = selectedArtists.length * feePerArtist;
    setTotalFee(totalFees);
  }, [formData.eventCountry, selectedArtists]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedArtistsData = selectedArtists
      .map((id) => {
        const artist = artists.find((artist) => artist.id === id);
        return artist ? { id: artist.id, pseudo: artist.pseudo } : null;
      })
      .filter(Boolean);

    const queryParams = new URLSearchParams(
      Object.entries({
        ...formData,
        totalFee: totalFee.toString(),
        selectedArtists: JSON.stringify(selectedArtists),
      }).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    router.push(`/reservation/summary?${queryParams}`);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input
        type="text"
        placeholder="Prénom"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        required
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="Nom"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
        className={styles.inputField}
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="Adresse de l'événement"
        value={formData.eventAddress}
        onChange={(e) =>
          setFormData({ ...formData, eventAddress: e.target.value })
        }
        required
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="Ville de l'événement"
        value={formData.eventCity}
        onChange={(e) =>
          setFormData({ ...formData, eventCity: e.target.value })
        }
        required
        className={styles.inputField}
      />
      <input
        type="text"
        placeholder="Code postal de l'événement"
        value={formData.eventPostalCode}
        onChange={(e) =>
          setFormData({ ...formData, eventPostalCode: e.target.value })
        }
        required
        className={styles.inputField}
      />
      <select
        value={formData.eventCountry}
        onChange={(e) =>
          setFormData({ ...formData, eventCountry: e.target.value })
        }
        required
        className={styles.selectField}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={formData.eventDate}
        onChange={(e) =>
          setFormData({ ...formData, eventDate: e.target.value })
        }
        required
        className={styles.inputField}
      />
      <input
        type="time"
        value={formData.eventHour || ""}
        onChange={(e) =>
          setFormData({ ...formData, eventHour: e.target.value })
        }
        required
        className={styles.inputField}
      />
      <input
        type="number"
        placeholder="Nombre de personnes"
        value={formData.numberOfPeople}
        onChange={(e) =>
          setFormData({
            ...formData,
            numberOfPeople: parseInt(e.target.value),
          })
        }
        required
        className={styles.inputField}
      />
      <select
        value={formData.serviceType}
        onChange={(e) =>
          setFormData({ ...formData, serviceType: e.target.value })
        }
        required
        className={styles.selectField}
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
        className={styles.inputField}
      />
      <h3>Sélectionnez les artistes</h3>
      <div className={styles.artistSelectionContainer}>
        {artists.map((artist) => (
          <div key={artist.id} className={styles.artistSelection}>
            <input
              type="checkbox"
              id={`artist-${artist.id}`}
              checked={selectedArtists.includes(artist.id)}
              onChange={() => handleArtistSelection(artist.id)}
            />
            <label htmlFor={`artist-${artist.id}`}>
              <img
                src={artist.picture_one}
                alt={`Image de ${artist.pseudo}`}
                className={styles.artistThumbnail}
              />
              <p className="uppercase text-sm mt-2">{artist.pseudo}</p>
            </label>
          </div>
        ))}
      </div>
      <textarea
        placeholder="Commentaire"
        value={formData.comment}
        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
        className={styles.textArea}
      />
      <h3>Frais totaux : {totalFee} €</h3>

      <button type="submit" className={styles.submitButton}>
        Réserver
      </button>
    </form>
  );
};

export default ReservationPage;
