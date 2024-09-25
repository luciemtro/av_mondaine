"use client";

import { useState, useEffect } from "react";
import { Artist } from "@/app/types/artist.types"; // Importation du type

export default function ArtistCatalog() {
  // Spécifie que le state 'artists' est un tableau d'objets de type 'Artist'
  const [artists, setArtists] = useState<Artist[]>([]);
  // 'editingArtist' peut être un objet de type 'Artist' ou 'null'
  const [isEditing, setIsEditing] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
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

  useEffect(() => {
    // Récupérer la liste des artistes
    async function fetchArtists() {
      const response = await fetch("/api/artists");
      const data = await response.json();
      setArtists(data.artists);
    }
    fetchArtists();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet artiste ?")) {
      await fetch(`/api/artists?id=${id}`, {
        method: "DELETE",
      });
      setArtists(artists.filter((artist) => artist.id !== id));
    }
  };

  const handleEdit = (artist: Artist) => {
    setIsEditing(true);
    setEditingArtist(artist);
    setFormData({
      ...artist,
      weight: artist.weight.toString(),
      height: artist.height.toString(),
    });
  };

  const handleAddNew = () => {
    setIsEditing(true);
    setEditingArtist(null); // Réinitialiser le formulaire pour un nouvel ajout
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingArtist ? "PUT" : "POST";
    const url = editingArtist
      ? `/api/artists?id=${editingArtist.id}` // Utilisation de l'id dans le PUT
      : "/api/artists"; // POST pour un nouvel artiste

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Recharger la liste des artistes après modification ou ajout
    const response = await fetch("/api/artists");
    const data = await response.json();
    setArtists(data.artists);

    // Fermer le formulaire
    setIsEditing(false);
    setEditingArtist(null);
  };

  return (
    <div className="mt-28">
      <h1>Catalogue des artistes</h1>

      <button onClick={handleAddNew}>Ajouter un nouvel artiste</button>

      {/* Liste des artistes */}
      <div>
        {artists.map((artist) => (
          <div key={artist.id}>
            <p>
              {artist.pseudo} ({artist.city}, {artist.country}) - {artist.title}
            </p>
            {artist.picture_one && (
              <img
                src={artist.picture_one}
                alt={`${artist.pseudo} - ${artist.title}`}
                style={{ width: "200px", height: "auto" }} // Tu peux ajuster la taille ici
              />
            )}
            <button onClick={() => handleEdit(artist)}>Modifier</button>
            <button onClick={() => handleDelete(artist.id)}>Supprimer</button>
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout/modification */}
      {isEditing && (
        <div>
          <h2>
            {editingArtist ? "Modifier l'artiste" : "Ajouter un nouvel artiste"}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Pseudo"
              value={formData.pseudo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pseudo: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Poids"
              value={formData.weight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Taille"
              value={formData.height}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  height: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Ville"
              value={formData.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  city: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Pays"
              value={formData.country}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  country: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Titre"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Photo 1"
              value={formData.picture_one}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  picture_one: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Photo 2"
              value={formData.picture_two}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  picture_two: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Photo 3"
              value={formData.picture_three}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  picture_three: e.target.value,
                })
              }
            />
            <button type="submit">
              {editingArtist ? "Modifier" : "Ajouter"}
            </button>
            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
}
