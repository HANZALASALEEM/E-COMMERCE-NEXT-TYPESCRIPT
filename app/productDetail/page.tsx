"use client";
import Image from "next/image";
import React, { FormEvent, useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
type product = {
  id: number;
  title: string;
  description: string;
  brand: string;
  sellerName: string;
  price: number;
};

function ProductDetail() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  //   const userId = searchParams.get('user_id');
  const productId = searchParams.get("product_id");
  const router = useRouter();
  const [user_id, setUser_id] = useState<number>(
    parseInt(session?.user?.id as string)
  );
  const [cart_id, setCart_id] = useState(0);

  const [product_id, setProduct_id] = useState<number>(
    parseInt(productId as string)
  );
  const [item_id, setItem_id] = useState<number>(parseInt(productId as string));
  const [cartItemAmount, setCartItemAmount] = useState<number>(0);
  const [productData, setProductData] = useState<product | null>();
  useEffect(() => {
    setCart_id(user_id);
    fetchUniqueItems();
    console.log(user_id);
    console.log(product_id);
    // setProductData(JSON.parse(sessionStorage.getItem("productData") as string))
  }, []);

  const handleAddToCart = async () => {
    if (user_id) {
      try {
        const response = await fetch("/api/addToCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id, product_id }),
        });

        if (response.status === 201) {
          const data = await response.json();
          fetchCartItems();
          alert("Added in Cart");
        } else if (response.status === 409) {
          alert("Product already exists in cart");
        } else {
          console.log(" Error Status: ", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      router.replace("/signIn");
    }
  };

  const fetchUniqueItems = useCallback(async () => {
    if (item_id) {
      try {
        const response = await fetch("/api/fetchUniqueProduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item_id }),
        });
        if (response.status === 200) {
          const data = await response.json();
          setProductData(data.data);
        } else {
          console.error(
            "Failed to fetch cart items, status code:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
    }
  }, [item_id]);

  const fetchCartItems = useCallback(async () => {
    if (cart_id) {
      try {
        const response = await fetch("/api/fetchCartItems", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart_id }),
        });
        if (response.status === 200) {
          const data = await response.json();
          setCartItemAmount(data.data.items.length);
        } else {
          console.error(
            "Failed to fetch cart items, status code:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
    }
  }, [cart_id]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCartButton = () => {
    router.push(`/cart`);
  };

  return (
    <div className="flex-col">
      {/* navbar */}
      <div className="w-screen h-16 bg-slate-900 items-center justify-between flex flex-row py-2 px-4">
        {/* sell Button */}
        <div className=" h-full w-1/4 items-center justify-center flex">
          {/* <button
						className="bg-yellow-500 w-64 h-full rounded-2xl hover:border-yellow-500 hover:bg-slate-900 hover:text-white hover:border-2 cursor-pointer"
						// onClick={handleSellSomething}
					>
						Sell Something
					</button> */}
        </div>
        {/* search bar */}
        <div className=" h-full w-2/4 items-center justify-center flex">
          <div className="w-full md:w-3/4 h-full flex justify-center ">
            <div className="w-3/4 rounded-tl-2xl rounded-bl-2xl border-2 border-gray-400 pl-3 bg-white">
              <input className="w-full h-full" />
            </div>
            <div className="bg-yellow-500 w-16 flex items-center justify-center rounded-tr-2xl rounded-br-2xl">
              <Image
                src="/images/search.png"
                alt="search"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
        {/* cart Icon */}
        <div className="h-full w-1/4 flex items-center justify-center">
          <button
            onClick={handleCartButton}
            className="h-full w-full flex flex-col items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
              <p>{cartItemAmount}</p>
            </div>
            <Image
              src="/images/grocery-store.png"
              alt="cart"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
      <div className=" w-screen flex md:flex-row flex-col py-10">
        {/* image container */}
        <div className="w-full md:w-1/3 h-full flex items-center justify-center">
          <Image
            src="/images/product-img.jpg"
            alt="product image"
            width={350}
            height={600}
          />
        </div>
        {/* title container */}
        <div className="w-full md:w-1/3 h-full flex flex-col items-start justify-center pt-16">
          <h1 className="text-2xl font-semibold px-4">{productData?.title}</h1>
          <p className="px-4 py-4">Price: {productData?.price} $</p>
          <p className="px-4">Seller Name: {productData?.sellerName}</p>
        </div>
        {/* add to cart container */}
        <div className="w-full md:w-1/3 flex items-center justify-center">
          <div className="border-2 border-gray-400 w-96 flex flex-col my-4 mx-2 items-center justify-center rounded-xl">
            <button
              className="bg-yellow-500 w-64 h-8 my-3 rounded-xl hover:border-yellow-500 hover:bg-white hover:border-2"
              onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="bg-yellow-500 w-64 h-8 my-3 rounded-xl hover:border-yellow-500 hover:bg-white hover:border-2">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="px-4">
        <p>{productData?.description}</p>
      </div>
    </div>
  );
}

export default ProductDetail;
