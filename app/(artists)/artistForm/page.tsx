"use client"; // Nécessaire pour le rendu côté client dans Next.js 13+

import { useState } from "react";

export default function ArtistForm() {
  const [formData, setFormData] = useState({
    pseudo: "",
    weight: "",
    height: "",
    city: "",
    country: "",
    title: "",
    description: "",
    picture_one: "",
    picture_two: "",
    picture_three: "",
  });
  const [message, setMessage] = useState<string | null>(null); // Pour afficher les messages de succès/erreur
  const [loading, setLoading] = useState(false);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Artiste ajouté avec succès !");
        setFormData({
          pseudo: "",
          weight: "",
          height: "",
          city: "",
          country: "",
          title: "",
          description: "",
          picture_one: "",
          picture_two: "",
          picture_three: "",
        });
      } else {
        setMessage(data.error || "Erreur lors de l'ajout de l'artiste.");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Ajouter un nouvel artiste</h1>
      {message && <p>{message}</p>}{" "}
      {/* Affiche le message de succès ou d'erreur */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pseudo:</label>
          <input
            type="text"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Poids (en kg):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Taille (en cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ville:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Pays:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Titre:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image 1 (URL):</label>
          <input
            type="text"
            name="picture_one"
            value={formData.picture_one}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image 2 (URL):</label>
          <input
            type="text"
            name="picture_two"
            value={formData.picture_two}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image 3 (URL):</label>
          <input
            type="text"
            name="picture_three"
            value={formData.picture_three}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter l'artiste"}
          </button>
        </div>
      </form>
    </div>
  );
}
