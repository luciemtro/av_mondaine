"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Spécifier le type de activeIndex comme 'number'
  const services = [
    {
      title: "Striptease à domicile",
      description:
        "Des performances privées dans l’intimité de votre domicile, alliant sensualité et élégance.",
      image:
        "https://i.ibb.co/HKn4G2Q/DALL-E-2024-10-05-09-04-19-A-sleek-minimalist-logo-design-for-a-luxurious-at-home-striptease-service.webp",
    },
    {
      title: "Spectacle OnlyFemme",
      description:
        "Des spectacles réservés aux femmes pour des soirées mémorables entre amies.",
      image:
        "https://i.ibb.co/pb55GW1/DALL-E-2024-10-05-10-20-25-A-sleek-minimalist-catalog-design-for-the-luxurious-Onlyfemme-show-featur.webp",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 10000); // Change de service toutes les 10 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle à la fin
  }, [services.length]);

  // Fonction pour changer de slide en cliquant sur les indicateurs
  const goToSlide = (index: number) => {
    setActiveIndex(index); // Le type de 'index' est maintenant explicite
  };

  return (
    <div className="services-container">
      <div className="services-linear-gradient"></div>
      <div className="carousel">
        {services.map((service, index) => (
          <div
            key={index}
            className={`service ${index === activeIndex ? "active" : ""}`}
          >
            <img
              src={service.image}
              alt={service.title}
              className="background-image"
            />
            <div className="service-text">
              <h3 className="uppercase">{service.title}</h3>
              <p>{service.description}</p>
              <Link href="/reservation">
                <button>Réservez Maintenant</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Indicateurs de pagination */}
      <div className="pagination">
        {services.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
