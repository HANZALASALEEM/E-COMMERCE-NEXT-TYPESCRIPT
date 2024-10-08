import { prisma } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req:Request,res:Response) {

    const body = await req.json()
    const {email,password} = body
    if (!email || !password) {
		return NextResponse.json({ msg: "All fields are required" },{status:400});
	}
    try {
		const findUser = await prisma.users.findUnique({
			where: {
				email: email,
			},
		});

		if (findUser) {
			return NextResponse.json({ msg: "User Already Exists" },{status:409});
		}

		const newUser = await prisma.users.create({
			data: {
				email: email,
				password: password,
			},
		});
		return NextResponse.json({ msg: "New User Created" ,data:newUser},{status:201});
	} catch (err) {
		return NextResponse.json({ msg: "Internal Server Error", data:err},{status:500});
	}

 
    
}