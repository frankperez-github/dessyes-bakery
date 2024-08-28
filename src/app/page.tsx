'use client';
import React, { useEffect, useState } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Item from './components/Item';
import { CircularProgress } from '@mui/material';
import Cart from './components/Cart';
import Layout from './components/Layout';
import Image from 'next/image';
import useIsClient from './hooks/useIsClient'; 

export default function Home() {
  const isClient = useIsClient(); 
  const [showOrder, setShowOrder] = useState(false);
  const [order, setOrder] = useState<{"products": any[], "total": number}>({
    "products": [],
    "total": 0
  });

  const [products, setProducts] = useState<any[]>([]);
  const [transportations, setTransportations] = useState<{city:string, transportation_price:number}[]>([]);

  const [MLCPrice, setMLCPrice] = useState<number>();
  const [USDPrice, setUSDPrice] = useState<number>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://api.cambiocuba.money/api/v2/x-rates?msg=false&x_cur=CUP&token=aCY78gC3kWRv1pR7VfgSlg");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMLCPrice(data.statistics["MLC.CUP"]["median"]);
        setUSDPrice(data.statistics["USD.CUP"]["median"]);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/transportations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(data => {
      setTransportations(data instanceof Array ? data : data.transportations);
      setIsLoading(false);
    });

    setIsLoading(true);

    fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(data => {
      setProducts(data instanceof Array ? data : data.products);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isClient && window.localStorage.getItem("order")) {
      setOrder(JSON.parse(window.localStorage.getItem("order")!));
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem("order", JSON.stringify(order));
    }
  }, [order, isClient]);

  return (
    <Layout cartCount={order.products.length} setShowOrder={setShowOrder}>
      {
        !isLoading ?
        <main className="bg-[#fff]">
          <div className="lg:flex xl:flex flex-wrap block">
            {
              products?.map((item, index) => (
                <SwiperSlide className='lg:!w-1/4 xl:!w-1/4 w-full pl-10' key={index}>
                  {
                    products?.filter(x => x.priority === index)[0] &&
                    <Item MLCPrice={MLCPrice!} USDPrice={USDPrice!} item={products?.filter(x => x.priority === index)[0]} quant={1} order={order} setOrder={setOrder} />
                  }
                </SwiperSlide>
              ))
            }
          </div>
          {
            showOrder &&
            <div className="">
              <Cart 
                products={products} 
                transportations={transportations} 
                setShowOrder={setShowOrder}
                order={order}
                setOrder={setOrder}
                MLCPrice={MLCPrice}
                USDPrice={USDPrice}
              />
            </div>
          }
        </main>
        :
        <div className="">
          <div className="w-[85%] fixed top-[20%] left-[10%] lg:left-2 xl:left-0 z-30 flex flex-col items-center lg:w-full mx-auto my-5 xl:ml-auto xl:mb-5">
            <Image src={process.env.NEXT_PUBLIC_LOGO || ""} className='' height={110} width={160} alt="logo" />
          </div>
          <div className="loading fixed top-[0%] left-[0%] pt-[90%] md:pt-[50%] lg:pt-[35%] xl:pt-[20%] pl-[49%] bg-slate-100 w-full h-full z-20">
            <CircularProgress />
            <h2 className='-ml-[62%] md:-ml-[45%] lg:-ml-44 xl:-ml-44 mt-5'>Bienvenido, espere mientras se cargan los productos...</h2>
          </div>
        </div>
      }
    </Layout>
  );
}
