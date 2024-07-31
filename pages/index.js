import ProductBox from "@/components/Product/ProductBox";
import WebPageBuilder from "@/components/WebPageBuilder";
import { get_category_products, HomePage } from "@/libs/api";
import Head from "next/head";
import React from "react";



export default function Home({ data }) {
  console.log(data,"data")
  return (
    <>
    <Head>
        <title>Go1 eCommerce</title>
        <meta name="description" content="Go1 eCommerce" />
     
      </Head> 
    <div className="flex min-h-[calc(100dvh-64px)] flex-col">
      <main className={`flex-1`}>
              <section className="mx-auto max-w-8xl p-8 pb-16">
              <ProductBox item={data}/>
              </section>
      </main>
    </div>
    </>
  );
}

export async function getServerSideProps(context) {

  const param = {
    page_no: 1,
    page_size: 16,
    route: "all-category"
}
  const resp = await get_category_products(param);
  const data = await resp.message;

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data },
    // revalidate: 120
  }
}