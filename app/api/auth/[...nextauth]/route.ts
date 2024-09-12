// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json(); // Récupérer la réponse JSON complète

        // Debug : Affiche la réponse
        console.log("User fetched from API:", data);

        if (res.ok && data?.user) {
          // Extraire l'utilisateur directement
          const user = data.user;

          // Retourner l'utilisateur avec id, email, et rôle
          return {
            id: user.id,
            email: credentials?.email, // Utiliser l'email des credentials
            role: user.role, // Le rôle doit être présent ici
          };
        }

        // Si l'utilisateur est invalide ou absent, renvoie null
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.id;
        token.role = user.role || "user"; // Stocker le rôle dans le token JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string; // Assurez-vous que le rôle est stocké dans la session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
