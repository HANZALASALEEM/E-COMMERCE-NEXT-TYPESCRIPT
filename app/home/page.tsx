"use client";
import Image from "next/image";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cookies } from "next/headers";
type product = {
  title: string;
  description: string;
  brand: string;
  sellerName: string;
  price: number;
};

function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const [productList, setProductList] = useState<product[]>([]);
  const [user_id, setUser_id] = useState(parseInt(session?.user?.id as string));
  const [cart_id, setCart_id] = useState<number>(0);
  const [cartItemAmount, setCartItemAmount] = useState<number>(0);

  useEffect(() => {
    setCart_id(user_id);
  }, []);

  const handleSellSomething = () => {
    router.push("/sell");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/fetchProduct", {
          method: "GET",
        });

        if (response.status === 200) {
          const data = await response.json();
          setProductList(data.data);
        } else {
          console.error(
            "Failed to fetch products, status code:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProduct();
  }, []);

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
    }
  }, [cart_id]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleProductDetailPage = (item: any) => {
    // sessionStorage.setItem("product_id", item.id);
    // sessionStorage.setItem("productData",JSON.stringify(item))
    router.push(`/productDetail?product_id=${item.id}`);
  };
  const handleCartButton = () => {
    router.push(`/cart`);
  };

  return (
    // <>
    // {user_id ? (
    // 	<>
    <div>
      {/* navbar */}
      <div className="w-screen h-16 bg-slate-900 items-center justify-between flex flex-row py-2 px-4">
        {/* sell Button */}
        <div className=" h-full w-1/4 items-center justify-center flex">
          <button
            className="bg-yellow-500 w-64 h-full rounded-2xl hover:border-yellow-500 hover:bg-slate-900 hover:text-white hover:border-2 cursor-pointer"
            onClick={handleSellSomething}>
            Sell Something
          </button>
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
                alt="search icon"
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
              alt="cart icon"
              width={32}
              height={32}
            />
          </button>
        </div>
        {/* Sign Out Icon */}
        {session && (
          <div className="h-full w-1/4 flex items-center justify-center">
            <button onClick={() => signOut()}>
              <p className="text-white">Sign Out</p>
            </button>
          </div>
        )}
      </div>
      {productList.map((item) => (
        <div
          className="w-full my-3  px-16 flex items-center flex-col md:flex-row md:gap-4 border-2"
          // key={item.id}
        >
          <button
            className="w-64 h-64"
            onClick={() => handleProductDetailPage(item)}>
            <Image
              src="/images/product-img.jpg"
              alt="product image"
              width={256}
              height={256}
            />
          </button>
          <div className="w-full md:w-3/4 md:py-8 font-semibold">
            <h1 className="text-2xl">{item.title}</h1>
            <p className="text-sm">Brand: {item.brand}</p>
            <p className="text-sm">
              Price: <span className="text-green-400">{item.price} $</span>
            </p>
          </div>
        </div>
      ))}
    </div>
    //   </>
    // ):(<>
    // <div className="w-screen h-screen flex items-center justify-center">
    // 	<h1 className="text-2xl">Log In First</h1>
    // 	</div></>)}

    // </>
  );
}

export default Home;
