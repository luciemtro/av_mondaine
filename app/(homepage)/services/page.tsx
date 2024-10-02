"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const services = [
    {
      title: "Striptease à domicile",
      description:
        "Des performances privées dans l’intimité de votre domicile, alliant sensualité et élégance.",
      buttonText: "Réservez maintenant",
    },
    {
      title: "Spectacle OnlyFemme",
      description:
        "Des spectacles réservés aux femmes pour des soirées mémorables entre amies.",
      buttonText: "Réservez votre spectacle",
    },
    {
      title: "Enterrement de vie de jeune fille/garçon",
      description:
        "Transformez votre enterrement de vie de célibataire en un événement inoubliable.",
      buttonText: "Découvrez les artistes",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 5000); // Changer de service toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle à la fin
  }, [services.length]);

  return (
    <div className="services-container">
      <h2>Nos Services</h2>
      <h3>
        Offrez-vous des moments uniques et sur mesure avec nos performances
        artistiques exclusives
      </h3>
      <div className="carousel">
        {services.map((service, index) => (
          <div
            key={index}
            className={`service ${index === activeIndex ? "active" : ""}`}
          >
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <Link href="/reservation">
              <button>{service.buttonText}</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
