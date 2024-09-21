"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Order } from "@/app/types/order.types";

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session) {
        const res = await fetch("/api/orders_user");
        const data = await res.json();
        setOrders(data.orders || []);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (status === "loading" || loading) {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return <p>Vous devez être connecté pour voir vos commandes.</p>;
  }

  return (
    <div>
      <h1>Bienvenue, {session.user.email}</h1>

      {orders.length === 0 ? (
        <p>Vous n'avez aucune commande pour le moment.</p>
      ) : (
        <section className="mt-20">
          <h2 className="pb-5 pl-11 golden-text">Vos commandes</h2>
          {orders.map((order) => (
            <div key={order.id} className="mb-8">
              {/* Informations de la commande au-dessus du tableau */}
              <div className="order-info pl-11 pr-11">
                <h3>
                  Commande #{order.id} - Créée le{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </h3>
              </div>

              {/* Tableau des détails de la commande */}
              <div className="golden-border order-table ml-11 mr-11">
                <table>
                  <thead>
                    <tr>
                      <th>Date de l'événement</th>
                      <th>Heure de l'événement</th>
                      <th>Téléphone</th>
                      <th>Nombre de personnes</th>
                      <th>Type de service</th>
                      <th>Budget (€)</th>
                      {/* Afficher le commentaire seulement s'il existe */}
                      {order.comment && <th>Commentaire</th>}
                      <th>Artiste(s)</th>
                      <th>Adresse de l'événement</th>
                      <th>Prix total (€)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{new Date(order.event_date).toLocaleDateString()}</td>
                      <td>{order.event_hour}</td>
                      <td>{order.phone}</td>
                      <td>{order.number_of_people}</td>
                      <td>{order.service_type}</td>
                      <td>{order.budget}</td>
                      {/* Afficher la cellule de commentaire seulement s'il y a un commentaire */}
                      {order.comment && <td>{order.comment}</td>}
                      <td>
                        {order.artists
                          ? order.artists
                              .split(",")
                              .map((artist, index) => (
                                <span key={index}>{artist}</span>
                              ))
                          : "Aucun artiste sélectionné"}
                      </td>
                      <td>
                        {order.event_address}, {order.event_city},{" "}
                        {order.event_country}
                      </td>
                      <td>{order.total_fee} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default UserDashboard;
