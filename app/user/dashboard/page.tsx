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
    <div className="container_order_user">
      {orders.length === 0 ? (
        <p>Vous n'avez aucune commande pour le moment.</p>
      ) : (
        <section className="pt-20">
          <h1 className="text-center">Bienvenue, {session.user.email}</h1>
          <h2 className="pb-5 pl-11 text-center text-lg">Vos commandes</h2>
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-card pink-border shadow-md rounded-lg p-5 m-8"
            >
              {/* Informations de la commande */}
              <div className="order-header mb-4">
                <h3 className="text-lg text-center font-semibold pink-link">
                  Commande #{order.id} - Créée le{" "}
                  {new Date(order.created_at).toLocaleDateString()}
                </h3>
              </div>

              {/* Détails de la commande en tant que sections */}
              <div className="order-details grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="font-medium pink-link">Date de l'événement:</p>
                  <p>{new Date(order.event_date).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="font-medium pink-link">Heure de l'événement:</p>
                  <p>{order.event_hour}</p>
                </div>

                <div>
                  <p className="font-medium pink-link">Téléphone:</p>
                  <p>{order.phone}</p>
                </div>

                <div>
                  <p className="font-medium pink-link">Nombre de personnes:</p>
                  <p>{order.number_of_people}</p>
                </div>

                <div>
                  <p className="font-medium pink-link">Type de service:</p>
                  <p>{order.service_type}</p>
                </div>

                <div>
                  <p className="font-medium pink-link">Budget (€):</p>
                  <p>{order.budget}</p>
                </div>
                <div className="col-span-full">
                  <p className="font-medium pink-link">
                    Adresse de l'événement:
                  </p>
                  <p>
                    {order.event_address}, {order.event_city},{" "}
                    {order.event_country}
                  </p>
                </div>

                {order.comment && (
                  <div className="col-span-full ">
                    <p className="font-medium pink-link">Commentaire:</p>
                    <p>{order.comment}</p>
                  </div>
                )}

                <div className="col-span-full flex flex-col justify-center items-center">
                  <p className="font-medium pink-link">Artiste(s):</p>
                  <div className="flex flex-wrap">
                    {order.artists.split(",").map((artist, index) => (
                      <div
                        key={index}
                        className="artist-info pink-border flex flex-col items-center"
                      >
                        <img
                          src={order.artist_pictures.split(",")[index]} // Afficher la photo
                          alt={`Photo de ${artist}`}
                          className="w-12 h-12 rounded-full mr-2"
                        />
                        <p className="block">{artist}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-full">
                  <p className="font-medium pink-link text-center">
                    Prix total (€):
                  </p>
                  <p className="text-center">{order.total_fee} €</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default UserDashboard;
