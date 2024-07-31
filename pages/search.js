import ProductBox from '@/components/Product/ProductBox'
import { get_category_products } from '@/libs/api'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Search = ({data}) => {
    const[filter,setFilter]=useState()
  const route=useRouter()
//   console.log(route.query.query,"roo")
  useEffect(()=>{
     if(typeof window != undefined){
        if(data){
            handleFitlerArray()
        }
     }
  },[route.query.query])

  const handleFitlerArray=()=>{
    let query=route.query.query
    let array=[]
    console.log(data)
    let productName= data.filter((res,i)=>{return  res.item && res.item.toLowerCase().includes(query.toLowerCase())})
    let productBrand= data.filter((res,i)=>{return res.short_description && res.short_description.toLowerCase().includes(query.toLowerCase())})
    // console.log(productBrand,"projoij")
    array=[...productName,...productBrand]
    const maps =new Map()
    console.log(maps)
    const map =new Map(array.map(obj =>[obj.product, obj]))
    console.log(map,"map")
    const uniqueArray =Array.from(map.values());
    // console.log(uniqueArray)

    setFilter(uniqueArray)
    // console.log(array)
  }

  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col">
      <main className={`flex-1`}>
              <section className="mx-auto max-w-8xl p-8 pb-16">
                <h1 className='pb-8 text-xl font-semibold'>{`Search results for "${route.query.query}":`}</h1>
              <ProductBox item={filter}/>
              </section>
      </main>
    </div>
  )
}

export default Search

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