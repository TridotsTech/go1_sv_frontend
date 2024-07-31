import ProductBox from '@/components/Product/ProductBox'
import { get_category_products } from '@/libs/api'
import React from 'react'

const index = ({data,productRoute}) => {
    console.log(data,"list")
  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col">
    <main className={`flex-1`}>
            <section className="mx-auto max-w-8xl p-8 pb-16">
            <ProductBox item={data} productRoute={productRoute}/>
            </section>
    </main>
  </div>
  )
}

export default index

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
  return{
    props:{data,productRoute}
  }
}