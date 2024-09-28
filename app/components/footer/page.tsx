"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "@/app/styles/footer.module.scss"; // Import des styles SCSS

export const Footer = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerMenu}>
          <ul className="flex gap-4">
            <li>
              <Link href="/" className="">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/catalogArtist" className="">
                Catalogue
              </Link>
            </li>
            <li>
              <Link href="/reservation" className="">
                Réservation
              </Link>
            </li>
            <li>
              <Link href="mailto:contact@avenuemondaine.com" className="">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerInfo}>
          <button className={styles.hamburger} onClick={toggleMenu}>
            <span className={isMenuOpen ? styles.hamburgerOpen : ""}></span>
            <span className={isMenuOpen ? styles.hamburgerOpen : ""}></span>
            <span className={isMenuOpen ? styles.hamburgerOpen : ""}></span>
          </button>

          <div
            className={`${styles.infoMenu} ${isMenuOpen ? styles.open : ""}`}
          >
            <ul className="flex gap-4">
              <li>
                <Link href="/about">À propos</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Politique de confidentialité</Link>
              </li>
              <li>
                <Link href="/terms">Conditions d'utilisation</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="legal">
          <div className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.dropdownToggle}>
              <button className="text-xs">
                Informations légales
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/legal-mentions" className="text-xs">
                  Mentions légales
                </Link>
                <Link href="/cookie-policy" className="text-xs">
                  Politique des cookies
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className={styles.socialMedia}>
          <Link
            href="https://www.instagram.com/avenue.mondaine/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.socialIcon}
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.055 1.97.24 2.434.402a4.92 4.92 0 011.705 1.003 4.922 4.922 0 011.003 1.705c.163.464.347 1.264.402 2.434.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.055 1.17-.24 1.97-.402 2.434a4.921 4.921 0 01-1.003 1.705 4.921 4.921 0 01-1.705 1.003c-.464.163-1.264.347-2.434.402-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.055-1.97-.24-2.434-.402a4.92 4.92 0 01-1.705-1.003 4.922 4.922 0 01-1.003-1.705c-.163-.464-.347-1.264-.402-2.434C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.055-1.17.24-1.97.402-2.434a4.92 4.92 0 011.003-1.705 4.921 4.921 0 011.705-1.003c.464-.163 1.264-.347 2.434-.402C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.332.014 7.053.072 5.77.13 4.91.322 4.186.66a6.923 6.923 0 00-2.513 1.636 6.923 6.923 0 00-1.636 2.513c-.338.724-.53 1.584-.588 2.867C.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.947.058 1.283.25 2.143.588 2.867a6.923 6.923 0 001.636 2.513 6.923 6.923 0 002.513 1.636c.724.338 1.584.53 2.867.588 1.279.058 1.688.072 4.947.072 3.259 0 3.668-.014 4.947-.072 1.283-.058 2.143-.25 2.867-.588a6.923 6.923 0 002.513-1.636 6.923 6.923 0 001.636-2.513c.338-.724.53-1.584.588-2.867.058-1.279.072-1.688.072-4.947 0-3.259-.014-3.668-.072-4.947-.058-1.283-.25-2.143-.588-2.867a6.923 6.923 0 00-1.636-2.513 6.923 6.923 0 00-2.513-1.636c-.724-.338-1.584-.53-2.867-.588C15.668.014 15.259 0 12 0z" />
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zM18.406 4.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
            </svg>
          </Link>
          <Link
            href="https://www.facebook.com/AvenueMondaine"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={styles.socialIcon}
            >
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.414c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.144v3.24l-1.92.001c-1.506 0-1.797.715-1.797 1.763v2.309h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className={styles.footerCopy}>
        <p>&copy; 2024 - Tous droits réservés</p>
      </div>
    </footer>
  );
};

export default Footer;
