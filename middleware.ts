// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOption } from "./app/api/auth/[...nextauth]/route"; // Adjust the path to your NextAuth configuration
// import { getSession } from "next-auth/react";
// import { getToken } from "next-auth/jwt";

// // This function is used to handle requests
// export async function middleware(request: NextRequest) {
//   // Get the session using NextAuth
//   //   const session = await getServerSession(authOption);
//   const requestForNextAuth = {
//     headers: {
//       cookie: request.headers.get("cookie"),
//     },
//   };

//   const session = await getSession({ req: requestForNextAuth });
//   console.log("Session From Middleware : ", session);

//   // Check if session exists
//   if (!session) {
//     // If there is no session, redirect to /home
//     return NextResponse.redirect(new URL("/home", request.url));
//   }

//   // If session exists, allow the request to proceed
//   return NextResponse.next();
// }

// // Configuration for matching paths
// export const config = {
//   matcher: "/sell",
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXT_AUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request as any });

  console.log("Token From Middleware : ", token);

  if (!token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/sell",
};
