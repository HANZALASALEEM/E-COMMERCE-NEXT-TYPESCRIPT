import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (res:Response){
    try {
		const ProductList = await prisma.products.findMany({});

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
