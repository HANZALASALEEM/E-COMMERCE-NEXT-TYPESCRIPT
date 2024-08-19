import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// export async function POST (req:Request,res:Response){
//     const body = await req.json()
//     const { item_id } = body;
//     try {
// 		await prisma.cartItem.delete({
// 			where: {
// 				id: item_id,
// 			},
//             return NextResponse.json({msg:"Item Successfully Deleted From Cart"},{status:200})
// 		});
		
// 	} catch (err) {
// 		console.error(err);
// 		return NextResponse.json({msg:"Internal Server Error"},{status:500})
// 	}
// }


export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { item_id } = body;
  
      if (!item_id) {
        return NextResponse.json({ msg: 'Item ID is required' }, { status: 400 });
      }
  
      await prisma.cartItem.delete({
        where: {
          id: item_id,
        },
      });
  
      return NextResponse.json({ msg: 'Item Successfully Deleted From Cart' }, { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ msg: 'Internal Server Error' }, { status: 500 });
    }
  }
