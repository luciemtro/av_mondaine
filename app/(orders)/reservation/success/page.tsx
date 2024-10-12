// app/reservation/success/page.tsx
export default function Success() {
  return (
    <div className="flex justify-center items-center success-container flex-col">
      <h1 className="text-xl golden-text p-5">Paiement réussi !</h1>
      <p>
        Merci pour votre réservation. Un email de confirmation vous a été
        envoyé.
      </p>
    </div>
  );
}
