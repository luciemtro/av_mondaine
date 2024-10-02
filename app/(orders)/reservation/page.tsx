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
      <h3 className="text-center pb-6">Informations personnelles</h3>
      <div className={styles.formSection}>
        <section>
          <label htmlFor="firstName">Prénom*</label>
          <input
            id="firstName"
            type="text"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
        <section>
          <label htmlFor="lastName">Nom*</label>
          <input
            id="lastName"
            type="text"
            placeholder="Nom"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
        <section>
          <label htmlFor="phone">Téléphone*</label>
          <input
            id="phone"
            type="tel"
            placeholder="Téléphone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
      </div>

      <h3 className="text-center pb-6">Informations de l'événement</h3>
      <div className={styles.formSection}>
        <section>
          <label htmlFor="eventAddress">Adresse de l'événement*</label>
          <input
            id="eventAddress"
            type="text"
            placeholder="Adresse"
            value={formData.eventAddress}
            onChange={(e) =>
              setFormData({ ...formData, eventAddress: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
        <section>
          <label htmlFor="eventCity">Ville de l'événement*</label>
          <input
            id="eventCity"
            type="text"
            placeholder="Ville"
            value={formData.eventCity}
            onChange={(e) =>
              setFormData({ ...formData, eventCity: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
        <section>
          <label htmlFor="eventPostalCode">Code postal*</label>
          <input
            id="eventPostalCode"
            type="text"
            placeholder="Code postal"
            value={formData.eventPostalCode}
            onChange={(e) =>
              setFormData({ ...formData, eventPostalCode: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
        <section>
          <label htmlFor="eventCountry">Pays de l'événement*</label>
          <select
            id="eventCountry"
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
        </section>
        <section>
          <label htmlFor="eventDate">Date de l'événement*</label>
          <input
            id="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
        <section>
          <label htmlFor="eventHour">Heure de l'événement*</label>
          <input
            id="eventHour"
            type="time"
            value={formData.eventHour || ""}
            onChange={(e) =>
              setFormData({ ...formData, eventHour: e.target.value })
            }
            required
            className={styles.inputField}
          />
        </section>
        <section>
          <label htmlFor="numberOfPeople">Nombre de personnes*</label>
          <input
            id="numberOfPeople"
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
        </section>
        <section>
          <label htmlFor="serviceType">Type de service*</label>
          <select
            id="serviceType"
            value={formData.serviceType}
            onChange={(e) =>
              setFormData({ ...formData, serviceType: e.target.value })
            }
            required
            className={styles.selectField}
          >
            <option value="" disabled>
              Sélectionner un type de service*
            </option>
            <option value="striptease">Striptease</option>
            <option value="spectacle_femme">Spectacle Only femme</option>
          </select>
        </section>
        <section>
          <label htmlFor="budget">Budget*</label>
          <input
            id="budget"
            type="number"
            placeholder="Budget"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: parseInt(e.target.value) })
            }
            required
            className={styles.inputField}
          />
        </section>
      </div>

      <h3 className="text-center pb-6">Sélectionnez les artistes*</h3>
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
              <p>{artist.pseudo}</p>
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <section className="p-6 ">
          <label htmlFor="comment">Commentaire</label>
          <textarea
            id="comment"
            placeholder="Commentaire"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            className={styles.textArea}
          />
        </section>
      </div>

      <h3 className="text-center">Frais totaux : {totalFee} €</h3>
      <div className="flex justify-center">
        {" "}
        <button type="submit" className={styles.submitButton}>
          Réserver
        </button>
      </div>
    </form>
  );
};

export default ReservationPage;
