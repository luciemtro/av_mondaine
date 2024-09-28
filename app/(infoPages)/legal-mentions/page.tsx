"use client";
import styles from "@/app/styles/infoPages.module.scss"; // Import des styles partagés

const MentionsLegales = () => {
  return (
    <section className={styles.infoSection}>
      <h1>Mentions Légales</h1>
      <div className={styles.infoContainer}>
        <article className={`${styles.infoItem} golden-border`}>
          <h2>1. Introduction</h2>
          <p>
            Les présentes mentions légales régissent l'utilisation du site
            internet Avenue Mondaine.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>2. Éditeur du Site</h2>
          <p>
            Le site Avenue Mondaine est édité par Avenue Mondaine, [adresse de
            l'entreprise], [numéro de téléphone],{" "}
            <a href="mailto:contact@avenuemondaine.com">
              contact@avenuemondaine.com
            </a>
            .
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>3. Hébergement</h2>
          <p>
            Le site est hébergé par Hostinger, UAB 'Hostinger', Jonavos g. 60C,
            44192, Kaunas, Lituanie, numéro de téléphone :{" "}
            <a href="tel:+37052041650">+370 5 204 16 50</a>, adresse e-mail :{" "}
            <a href="mailto:support@hostinger.com">support@hostinger.com</a>.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>4. Propriété Intellectuelle</h2>
          <p>
            Tous les éléments du site Avenue Mondaine sont protégés par le droit
            d'auteur, le droit des marques et le droit des brevets. Toute
            reproduction, représentation, modification, publication, adaptation
            de tout ou partie des éléments du site, quel que soit le moyen ou le
            procédé utilisé, est interdite, sauf autorisation écrite préalable
            de Avenue Mondaine.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>5. Données Personnelles</h2>
          <p>
            Avenue Mondaine s'engage à protéger les données personnelles de ses
            utilisateurs conformément à la législation en vigueur. Pour plus
            d'informations, consultez notre{" "}
            <a href="/privacy-policy">politique de confidentialité</a>.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>6. Litiges</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En
            cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>7. Contact</h2>
          <p>
            Pour toute question, veuillez nous contacter à l'adresse suivante :{" "}
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

export default MentionsLegales;
