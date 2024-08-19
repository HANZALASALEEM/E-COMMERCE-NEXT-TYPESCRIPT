import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST (req:Request,res:Response){
    const body = await req.json()
    const {item_id} = body
    try {
		const ProductList = await prisma.products.findUnique({
            where:{
                id:item_id,
            },
        });

		if (ProductList) {
            return NextResponse.json({msg:"Product Fetched Successfully",data:ProductList},{status:200})
		} else {
			return NextResponse.json({msg:"Product Not Found "},{status:404})
		}
	} catch (err) {
		console.error(err);
		return NextResponse.json({msg:"Internal Server Error"},{status:500})
	}
}