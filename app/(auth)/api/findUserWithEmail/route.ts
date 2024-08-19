import { prisma } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req:Request,res:Response) {

    const body = await req.json()
    const {userEmail} = body
    try {
		const findUser = await prisma.users.findUnique({
			where: {
				email: userEmail,
			},
		});

		return NextResponse.json({ msg: "Found User Of That Email" ,data:findUser},{status:200});
	} catch (err) {
		return NextResponse.json({ msg: "Internal Server Error" },{status:500});
	}

 
    
}