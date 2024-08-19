import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json(
      { msg: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const validUser = await prisma.users.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (validUser) {
      return NextResponse.json(
        { msg: "User Signed In", data: validUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ msg: "User Not Found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
