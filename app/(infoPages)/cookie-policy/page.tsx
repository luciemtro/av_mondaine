"use client";
import styles from "@/app/styles/infoPages.module.scss"; // Import des styles partagés

const PolitiqueCookies = () => {
  return (
    <section className={styles.infoSection}>
      <h1>Politique des Cookies</h1>
      <div className={styles.infoContainer}>
        <article className={`${styles.infoItem} golden-border`}>
          <h2>1. Introduction</h2>
          <p>
            Cette politique de cookies explique comment Avenue Mondaine utilise
            des cookies et des technologies similaires pour améliorer votre
            expérience sur notre site web.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>2. Qu'est-ce qu'un Cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte stocké sur votre appareil
            lorsque vous visitez certains sites web. Les cookies permettent de
            collecter des informations concernant votre navigation et vos
            préférences.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>3. Types de Cookies Utilisés</h2>
          <p>Nous utilisons différents types de cookies :</p>
          <ul>
            <li>
              <strong>Cookies Essentiels</strong> : Ces cookies sont nécessaires
              au bon fonctionnement du site et ne peuvent pas être désactivés.
            </li>
            <li>
              <strong>Cookies de Performance</strong> : Ils nous permettent de
              mesurer la fréquentation et l'utilisation de notre site pour
              améliorer son fonctionnement.
            </li>
            <li>
              <strong>Cookies Publicitaires</strong> : Ils sont utilisés pour
              vous présenter des publicités en fonction de vos centres
              d'intérêt.
            </li>
          </ul>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>4. Gestion des Cookies</h2>
          <p>
            Vous pouvez choisir d'accepter ou de refuser les cookies via les
            paramètres de votre navigateur. Sachez que la désactivation des
            cookies peut affecter votre expérience sur notre site.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>5. Modifications de la Politique de Cookies</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique à tout
            moment. Toute modification sera publiée sur cette page.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>6. Contact</h2>
          <p>
            Pour toute question concernant cette politique de cookies, veuillez
            nous contacter à l'adresse suivante :{" "}
            <a href="mailto:contact@avenuemondaine.com">
              contact@avenuemondaine.com
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  );
};

export default PolitiqueCookies;
