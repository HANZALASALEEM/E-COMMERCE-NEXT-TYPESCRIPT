import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOption: NextAuthOptions = {
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        if (!profile?.email) {
          throw new Error("No Profile");
        }

        try {
          const user = await prisma.users.upsert({
            where: { email: profile.email },
            create: {
              email: profile.email,
              name: profile.name,
            },
            update: {
              name: profile.name,
            },
          });

          const findUser = await prisma.users.findUnique({
            where: { email: profile.email },
          });

          if (findUser) {
            profile.sub = findUser.id;
          } else {
            throw new Error("User not found after upsert");
          }
        } catch (error) {
          console.error("Error upserting user:", error.message);
          console.error("Stack trace:", error.stack);
          throw new Error("Database operation failed");
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await prisma.users.findUnique({
          where: { email: credentials?.email, password: credentials?.password },
        });
        if (!existingUser) {
          return null;
        }
        if (existingUser) {
          return {
            id: `${existingUser.id}`,
            email: existingUser.email,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
