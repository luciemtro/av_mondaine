"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div>
        {/* Logo ou liens vers d'autres pages */}
        <a href="/" className="text-lg font-bold">
          MonSite
        </a>
      </div>
      <div>
        {status === "authenticated" && session?.user ? (
          <div className="flex items-center space-x-4">
            <p>Bienvenue, {session.user.email}</p>
            <a
              href="/user/dashboard"
              className="text-blue-300 hover:text-blue-500"
            >
              Mes commandes
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <a href="/auth/login" className="text-blue-300 hover:text-blue-500">
            Connexion
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
