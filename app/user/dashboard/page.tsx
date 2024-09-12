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
        const res = await fetch("/api/orders");
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
        <div>
          <h2>Vos commandes</h2>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <p>
                  Commande #{order.id} - {order.total_fee} € -{" "}
                  {new Date(order.event_date).toLocaleDateString()}
                </p>
                <p>Artistes : {order.artists || "Aucun artiste sélectionné"}</p>
                <p>
                  Adresse : {order.event_address}, {order.event_city},{" "}
                  {order.event_country}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
