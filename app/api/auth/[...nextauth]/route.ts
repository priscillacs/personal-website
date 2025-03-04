import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// Create and export the handler functions for GET and POST
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
