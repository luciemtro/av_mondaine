import Link from "next/link"; // Import pour Next.js Link

export default function Hero() {
  return (
    <div className="hero-container">
      <h2>Transformez votre événement avec Avenue Mondaine</h2>
      <h3>
        Striptease à domicile et spectacles réservés aux femmes, pour des
        moments inoubliables
      </h3>
      <Link href="/catalogArtist">
        <button className="hero-button">Découvrez nos artistes</button>
      </Link>
    </div>
  );
}
