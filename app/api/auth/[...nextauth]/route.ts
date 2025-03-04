// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Define the authentication options
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form
      name: "Admin Access",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple password check - in production, use environment variables
        // and a proper hashing mechanism
        const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword";

        if (credentials?.password === adminPassword) {
          // Return a user object if authentication is successful
          return { id: "1", name: "Admin" };
        } else {
          // Return null if authentication fails
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login", // Custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the token
      if (user) {
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add the user's name to the session
      if (session.user) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
};

// Create and export the handler functions for GET and POST
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
