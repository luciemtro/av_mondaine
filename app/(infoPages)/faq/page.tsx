"use client";
import styles from "@/app/styles/infoPages.module.scss"; // Import des styles partagés

const FAQ = () => {
  return (
    <section className={styles.infoSection}>
      <h1>FAQ</h1>
      <div className={styles.infoContainer}>
        <article className={`${styles.infoItem} golden-border`}>
          <h2>
            1. Quelle est la garantie de satisfaction offerte par votre agence ?
          </h2>
          <p>
            Nous offrons une garantie de satisfaction pour toutes nos
            prestations. Si vous n'êtes pas pleinement satisfait(e) de la
            performance ou de l'organisation, nous proposons un artiste
            remplaçant. Si aucun remplaçant n'est disponible, nous vous
            remboursons intégralement ou reprogrammons l'événement à une date
            convenue avec vous.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>
            2. Comment assurez-vous la qualité de l'organisation de l'événement
            ?
          </h2>
          <p>
            Nous nous engageons à offrir une organisation exceptionnelle, avec
            une coordination et un professionnalisme irréprochables. Chaque
            détail est soigneusement planifié pour garantir une expérience
            fluide et mémorable.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>3. Vos prestataires sont-ils fiables ?</h2>
          <p>
            Oui, nos prestataires sont sélectionnés pour leur fiabilité et leur
            engagement. Ils sont rigoureusement vérifiés pour garantir leur
            présence et leur performance, évitant ainsi toute annulation de
            dernière minute.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>4. Les surprises durant l'événement sont-elles appropriées ?</h2>
          <p>
            Absolument. Chaque surprise est soigneusement conceptualisée et
            planifiée avec la participation de l'organisateur de l'événement
            pour être appropriée et agréable, ajoutant une touche mémorable à la
            fête tout en respectant les préférences des futurs mariés.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>5. Comment garantissez-vous la qualité des performances ?</h2>
          <p>
            Nos artistes, musiciens et animateurs sont choisis pour leur talent
            et leur capacité à offrir des performances de qualité
            exceptionnelle. Nous nous assurons qu'ils répondent aux attentes les
            plus élevées.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>6. La sécurité des participantes est-elle assurée ?</h2>
          <p>
            La sécurité est notre priorité. Chacun de nos prestataires est
            assuré. Les lieux et les activités sont rigoureusement vérifiés pour
            garantir un environnement sûr pour toutes les participantes.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>7. Le budget sera-t-il respecté ?</h2>
          <p>
            Nous veillons à respecter le budget établi, avec des coûts
            transparents et sans frais cachés. Vous serez informé(e) de tous les
            détails financiers avant l'événement.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>8. L'événement sera-t-il personnalisé ?</h2>
          <p>
            Oui, chaque événement est entièrement personnalisé selon les goûts
            et les attentes de nos clients. Nous travaillons en étroite
            collaboration avec vous pour créer une expérience unique.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>
            9. Comment gérez-vous la communication avec les organisateurs ?
          </h2>
          <p>
            Nous maintenons une communication ouverte et claire entre notre
            agence et les organisateurs pour éviter les malentendus et les
            erreurs. Vous serez informé(e) de chaque étape de l'organisation.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>10. La logistique de l'événement sera-t-elle bien gérée ?</h2>
          <p>
            Oui, la logistique est parfaitement gérée, avec des arrangements de
            transport, d'hébergement et des horaires sans accroc. Nous nous
            assurons que tout se déroule de manière fluide.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>11. Que se passe-t-il en cas de météo défavorable ?</h2>
          <p>
            Nous prévoyons des alternatives en cas de conditions météorologiques
            défavorables pour les événements en plein air, afin que la fête se
            déroule sans interruption.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>12. Les paiements sont-ils transparents ?</h2>
          <p>
            Oui, la facturation est claire et précise, avec des paiements
            enregistrés et aucun frais caché. Vous recevrez tous les détails
            financiers de manière transparente.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>
            13. Que se passe-t-il en cas d'annulation de dernière minute ?
          </h2>
          <p>
            En cas d'annulation de dernière minute, nous proposons des
            alternatives convenables pour assurer la continuité de l'événement,
            ou nous procédons à un remboursement intégral si nécessaire.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>14. L'événement sera-t-il privé et exclusif ?</h2>
          <p>
            Oui, la fête est organisée de manière à être privée et exclusive,
            sans intrusions non désirées. Nous veillons à ce que l'intimité des
            participantes soit respectée.
          </p>
        </article>

        <div className={styles.contactInfo}>
          <p>
            Pour toute autre question, n'hésitez pas à nous contacter à{" "}
            <a href="tel:[Numéro de Téléphone]">[Numéro de Téléphone]</a> ou{" "}
            <a href="mailto:contact@avenuemondaine.com">
              contact@avenuemondaine.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
