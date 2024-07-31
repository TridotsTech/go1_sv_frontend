import ProductBox from '@/components/Product/ProductBox'
import { get_category_filters, get_category_products, getCurrentUrl, seo_Image } from '@/libs/api'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const Index = ({data,productRoute,filterInfo, currentId}) => {
    console.log(data,"list")
    const router = useRouter();
  const [filtersList, setFiltersList] = useState();
  const [currentRoute, setCurrentRoute] = useState()
    useEffect(()=>{
      if (typeof window != 'undefined') {
      setFiltersList(filterInfo)
      setCurrentRoute(currentId)
    }
    })
  return (
    <>
    <Head>
        <title>{filterInfo?.meta_info?.meta_title}</title>
        <meta name="description" content={filterInfo?.meta_info?.meta_description} />
        <meta property="og:type" content={'List'} />
        <meta property="og:title" content={filterInfo?.meta_info?.meta_title} />
        <meta key="og_description" property="og:description" content={filterInfo?.meta_info?.meta_description} />
        <meta property="og:image" content={seo_Image(filterInfo?.meta_info?.meta_image)}></meta>
        <meta property="og:url" content={getCurrentUrl(router.asPath)}></meta>
        <meta name="twitter:image" content={seo_Image(filterInfo?.meta_info?.meta_image)}></meta>
      </Head>

    <div className="flex min-h-[calc(100dvh-64px)] flex-col">
    <main className={`flex-1`}>
            <section className="mx-auto max-w-8xl p-8 pb-16">
            <ProductBox item={data} productRoute={productRoute}/>
            </section>
    </main>
  </div>
    </>
  )
}

export default Index

export async function getServerSideProps({params}){
    let productRoute = ''
    let value = params.list
  
    value.map((r, i) => {
      productRoute = productRoute + r + ((value.length != (i + 1)) ? '/' : '')
    })
    const param = {
        page_no: 1,
        page_size: 16,
        route: productRoute
    }
      const resp = await get_category_products(param);
      const data = await resp.message;
    
      if (!data) {
        return {
          notFound: true,
        }
      }
      let filterInfo = ''
      let currentId = ''
    
      let datas = { "route": productRoute }
      let res = await get_category_filters(datas);
      if (res && res.message) {
        filterInfo = res.message
        if (res.message.category_list && res.message.category_list.current_category && res.message.category_list.current_category.category_name) {
          currentId = res.message.category_list.current_category
        }
      }
  return{
    props:{data,productRoute, filterInfo, currentId}
  }
}