import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST (req:Request,res:Response){
const body = await req.json()
    const { cart_id } = body;
	try {
		const cart = await prisma.cart.findUnique({
			where: {
				id: cart_id,
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		if (cart) {
			return NextResponse.json({msg:"Cart Data Fetched Successfully",data:cart},{status:200})
		} else {
			return NextResponse.json({msg:"Items Not Found in Cart"},{status:404})
		}
	} catch (err) {
		console.error(err);
		return NextResponse.json({msg:"Internal Server Error" ,genratedMsg:err},{status:500})
	}
}
