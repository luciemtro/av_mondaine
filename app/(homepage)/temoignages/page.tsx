import Link from "next/link";

export default function Temoignages() {
  return (
    <div className="temoignages-container">
      <h2>Ce que disent nos clients</h2>

      <div className="temoignage-card">
        <div className="image-container">
          {/* Placeholder pour l'image de l'Instagram Story */}
          <img
            src="https://i.ibb.co/J5ZCvd6/instagram-Temoignage.png"
            alt="Aperçu des témoignages Instagram"
          />
        </div>
        <div className="card-content">
          <p>
            Découvrez ce que nos clients disent de leur expérience avec Avenue
            Mondaine.
          </p>
          <Link href="https://www.instagram.com/stories/highlights/17982344792528644/">
            <button className="cta-button">Voir les témoignages</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
