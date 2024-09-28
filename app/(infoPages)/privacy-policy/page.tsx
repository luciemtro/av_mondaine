"use client";
import styles from "@/app/styles/infoPages.module.scss"; // Import des styles partagés

const PolitiqueConfidentialite = () => {
  return (
    <section className={styles.infoSection}>
      <h1>Politique de Confidentialité</h1>
      <div className={styles.infoContainer}>
        <article className={`${styles.infoItem} golden-border`}>
          <h2>1. Introduction</h2>
          <p>
            Cette politique de confidentialité décrit comment Avenue Mondaine
            collecte, utilise et protège les informations personnelles que vous
            fournissez sur notre site web.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>2. Collecte des Données</h2>
          <p>
            Nous collectons diverses informations lorsque vous naviguez sur
            notre site ou que vous effectuez une réservation, telles que votre
            nom, adresse, adresse e-mail, numéro de téléphone et informations de
            paiement.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>3. Utilisation des Données</h2>
          <p>
            Les informations que nous collectons sont utilisées pour traiter vos
            réservations, répondre à vos demandes, améliorer nos services et
            vous envoyer des communications marketing.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>4. Protection des Données</h2>
          <p>
            Nous mettons en œuvre diverses mesures de sécurité pour protéger vos
            informations personnelles contre tout accès, modification,
            divulgation ou destruction non autorisés.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>5. Partage des Données avec des Tiers</h2>
          <p>
            Nous ne vendons, n'échangeons ni ne transférons vos informations
            personnelles à des tiers, sauf dans les cas où cela est nécessaire
            pour fournir les services demandés ou pour se conformer à la loi.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>6. Utilisation des Cookies</h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience de
            navigation. Vous pouvez choisir de désactiver les cookies via les
            paramètres de votre navigateur.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>7. Vos Droits</h2>
          <p>
            Vous avez le droit d'accéder à vos informations personnelles, de les
            corriger, de les supprimer et de vous opposer à leur traitement.
            Pour exercer ces droits, veuillez nous contacter à l'adresse
            suivante :{" "}
            <a href="mailto:contact@avenuemondaine.com">
              contact@avenuemondaine.com
            </a>
            .
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>8. Modifications de la Politique de Confidentialité</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de
            confidentialité à tout moment. Toute modification sera publiée sur
            cette page.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>9. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité,
            veuillez nous contacter à l'adresse suivante :{" "}
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

export default PolitiqueConfidentialite;
