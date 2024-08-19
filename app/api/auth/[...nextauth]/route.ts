import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
// import {PrismaAdapter} from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const authOption: NextAuthOptions = {
  // adapter:PrismaAdapter(prisma),
  pages: {
    signIn: "/signIn",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    // GoogleProvider({
    //   clientId: GOOGLE_CLIENT_ID!,
    //   clientSecret: GOOGLE_CLIENT_SECRET!,
    //   async profile(profile) {
    //     if (!profile?.email) {
    //       throw new Error("No Profile");
    //     }

    //     try {
    //       const user = await prisma.users.upsert({
    //         where: { email: profile.email },
    //         create: {
    //           email: profile.email,
    //           name: profile.name,
    //         },
    //         update: {
    //           name: profile.name,
    //         },
    //       });

    //       const findUser = await prisma.users.findUnique({
    //         where: {
    //           email: profile.email,
    //         },
    //       });

    //       profile.sub = findUser?.id;

    //       console.log("Profile : ", profile);
    //     } catch (error) {
    //       console.error("Error upserting user:", error);
    //     }
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //     };
    //   },
    // }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        if (!profile?.email) {
          throw new Error("No Profile");
        }

        try {
          // Upsert user in the database
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

          // Fetch user details
          const findUser = await prisma.users.findUnique({
            where: { email: profile.email },
          });

          if (findUser) {
            profile.sub = findUser.id;
          } else {
            throw new Error("User not found after upsert");
          }

          console.log("Profile: ", profile);
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
        // console.log("Credentials : ", credentials);
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
    // async signIn({ account, profile, user }) {
    //   console.log("Sign In Callback account : ", account);
    //   console.log("Sign In Callback profile : ", profile);
    //   console.log("Sign In Callback user : ", user);

    //   // if (!profile?.email) {
    //   //   try {
    //   //     const newUser = await prisma.users.upsert({
    //   //       where: { email: user.email! },
    //   //       create: {
    //   //         email: user.email!,
    //   //         //   password:user.password!,
    //   //       },
    //   //       update: {
    //   //         // name: user.name,
    //   //       },
    //   //     });
    //   //     // return NextResponse.json({msg:"User Sign in With Google", data:user},{status:200})
    //   //     return true;
    //   //   } catch (error) {
    //   //     console.error("Error upserting user:", error);
    //   //     return false;
    //   //   }
    //   }

    //   try {
    //     const user = await prisma.users.upsert({
    //       where: { email: profile.email },
    //       create: {
    //         email: profile.email,
    //         // name: profile.name,
    //       },
    //       update: {
    //         // name: profile.name,
    //       },
    //     });
    //     // return NextResponse.json({msg:"User Sign in With Google", data:user},{status:200})
    //     return true;
    //   } catch (error) {
    //     console.error("Error upserting user:", error);
    //     return false;
    //   }
    // },
    async session({ session, user, token }) {
      // console.log("Session callback token.sub : ", token.sub);
      session.user.id = token.sub;

      // console.log("Session Callback session : ", session);
      // console.log("Session Callback user : ", user);
      // console.log("Session Callback token : ", token);

      //    cookies().set("session",session)
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // const findUser = await prisma.users.findUnique({
      //   where: {
      //     email: token.email,
      //   },
      // });

      // console.log("JWT callback token : ", token);
      // console.log("JWT callback user : ", user);
      // console.log("JWT callback account : ", account);
      // console.log("JWT callback profile : ", profile);
      // // console.log("JWT callback : isNewUser", isNewUser);
      // // token.sub = profile?.sub;
      // console.log("JWT callback token.sub : ", token.sub);

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
// export const authOption;
