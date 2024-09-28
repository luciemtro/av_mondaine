"use client";
import styles from "@/app/styles/infoPages.module.scss"; // Import des styles partagés

const CGV = () => {
  return (
    <section className={styles.infoSection}>
      <h1>Conditions Générales de Vente (CGV)</h1>
      <div className={styles.infoContainer}>
        <article className={`${styles.infoItem} golden-border`}>
          <h2>1. Préambule</h2>
          <p>
            Les présentes conditions générales de vente (CGV) s'appliquent à
            toutes les ventes conclues sur le site internet Avenue Mondaine.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>2. Objet</h2>
          <p>
            Les présentes CGV ont pour objet de définir les droits et
            obligations des parties dans le cadre de la réservation en ligne des
            services proposés par Avenue Mondaine au consommateur.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>3. Acceptation des Conditions</h2>
          <p>
            Le client reconnaît avoir pris connaissance, au moment de la
            passation de commande, des présentes conditions générales de vente
            et déclare les accepter sans réserve.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>4. Services</h2>
          <p>
            Les services proposés à la réservation sont ceux qui figurent sur le
            site au jour de la consultation par l'utilisateur et dans la limite
            des créneaux disponibles. Avenue Mondaine se réserve le droit de
            modifier à tout moment l'offre de services.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>5. Prix</h2>
          <p>
            Les prix sont indiqués en euros, toutes taxes comprises (TTC), hors
            frais supplémentaires. Avenue Mondaine se réserve le droit de
            modifier ses prix à tout moment, mais le service sera facturé sur la
            base du tarif en vigueur au moment de la validation de la commande.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>6. Commande</h2>
          <p>
            Toute commande passée sur le site Avenue Mondaine vaut acceptation
            des prix et descriptions des services disponibles à la réservation.
            Avenue Mondaine accusera réception de la commande dès sa validation
            par l'envoi d'un courrier électronique.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>7. Paiement</h2>
          <p>
            Le paiement est exigible immédiatement à la réservation. Le client
            peut effectuer le règlement par carte de paiement ou via une
            solution de paiement en ligne sécurisée. Avenue Mondaine se réserve
            le droit de suspendre toute gestion de commande et toute prestation
            en cas de refus d'autorisation de paiement de la part des organismes
            officiellement accrédités ou en cas de non-paiement.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>8. Prestation de Service</h2>
          <p>
            Les services sont fournis à l'adresse indiquée par le client sur le
            formulaire de réservation. Les délais de prestation indiqués sur le
            site sont des délais indicatifs, correspondant aux délais moyens de
            traitement et de livraison. Avenue Mondaine ne peut être tenue
            responsable des conséquences d'un retard de prestation.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>9. Rétractation</h2>
          <p>
            Le client dispose d'un délai de 14 jours à compter de la date de la
            réservation pour annuler le service pour échange ou remboursement.
            Des frais d'annulation peuvent s'appliquer et sont à la charge du
            client.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>10. Garantie</h2>
          <p>
            Tous les services fournis par Avenue Mondaine bénéficient de la
            garantie légale prévue par les articles 1641 et suivants du Code
            civil. En cas de non-conformité d'un service fourni, il peut être
            reprogrammé, échangé ou remboursé.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>11. Garanties et Responsabilité</h2>
          <p>
            Avenue Mondaine ne peut être tenue responsable des dommages
            résultant d'une mauvaise utilisation des services fournis. Le client
            est seul responsable du choix des services, de leurs conditions et
            de leur utilisation.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>12. Données Personnelles</h2>
          <p>
            Les informations recueillies lors de la réservation du client sont
            nécessaires pour la gestion de la transaction et peuvent à ce titre
            être communiquées en tout ou partie aux prestataires de services
            d'Avenue Mondaine intervenant dans le cadre de l'exécution de la
            réservation. Le client est informé que ces données personnelles
            peuvent également être collectées par un organisme chargé d'analyser
            les commandes et de lutter contre la fraude à la carte bancaire.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>13. Propriété Intellectuelle</h2>
          <p>
            Tous les éléments du site internet Avenue Mondaine sont et restent
            la propriété intellectuelle et exclusive d'Avenue Mondaine. Nul
            n'est autorisé à reproduire, exploiter, rediffuser ou utiliser à
            quelque titre que ce soit, même partiellement, des éléments du site
            qu'ils soient sous forme de photos, logos, visuels ou textes.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>14. Litiges</h2>
          <p>
            Les présentes CGV sont soumises à la loi française. En cas de
            litige, le client contactera Avenue Mondaine pour obtenir une
            solution amiable. À défaut, le litige sera porté devant les
            tribunaux compétents.
          </p>
        </article>

        <article className={`${styles.infoItem} golden-border`}>
          <h2>15. Contact</h2>
          <p>
            Pour toute question ou information, le client peut contacter Avenue
            Mondaine par email à l'adresse{" "}
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

export default CGV;
