"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // Redirection vers /auth/login
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  // Si l'utilisateur est authentifié mais n'est pas un admin, il reste sur cette page
  if (session?.user?.role === "user") {
    return (
      <div>
        <h1>
          Bienvenue sur le tableau de bord utilisateur, {session?.user?.email}
        </h1>

        {/* Bouton de déconnexion */}
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })} // Redirection vers /auth/login après déconnexion
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Déconnexion
        </button>
      </div>
    );
  } else if (session?.user?.role === "admin") {
    router.push("/admin/dashboard"); // Rediriger les admins vers leur propre dashboard
    return null;
  }

  return null;
};

export default UserDashboard;
