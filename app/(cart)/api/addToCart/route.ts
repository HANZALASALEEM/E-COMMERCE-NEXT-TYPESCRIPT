import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, product_id } = body;

  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(user_id) },
    });

    if (!user) {
      return NextResponse.json({ msg: "User Not Found" }, { status: 404 });
    }

    const product = await prisma.products.findUnique({
      where: { id: Number(product_id) },
    });

    if (!product) {
      return NextResponse.json({ msg: "Product Not Found" }, { status: 404 });
    }

    const productAlreadyExist = await prisma.cartItem.findFirst({
      where: {
        product_id: Number(product_id),
        cart: {
          user_id: Number(user_id),
        },
      },
    });

    if (productAlreadyExist) {
      return NextResponse.json(
        { msg: "Product Already Exists in Cart" },
        { status: 409 }
      );
    }

    let userCart = await prisma.cart.findUnique({
      where: { user_id: Number(user_id) },
      include: { items: true },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          user: {
            connect: { id: Number(user_id) },
          },
          items: {
            create: {
              product: {
                connect: { id: Number(product_id) },
              },
            },
          },
        },
        include: { items: true },
      });
    } else {
      userCart = await prisma.cart.update({
        where: { id: userCart.id },
        data: {
          items: {
            create: {
              product: {
                connect: { id: Number(product_id) },
              },
            },
          },
        },
        include: { items: true },
      });
    }

    return NextResponse.json(
      { msg: "New Product Added to Cart", data: userCart },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error details:", err);
    return NextResponse.json(
      { msg: "Internal Server Error", error: err },
      { status: 500 }
    );
  }
}
