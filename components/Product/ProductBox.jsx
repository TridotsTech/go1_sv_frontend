import { check_Image } from '@/libs/api'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductBox = ({item,productRoute}) => {
    console.log(item)
  return (
    <div>
       {productRoute && <div>
            <h1 className='text-[20px] font-semibold mb-[30px] capitalize'>{productRoute && productRoute.replace("all-category/","")}</h1>
        </div>}
        <div className='grid md:grid-cols-1 grid-cols-3 gap-[30px]'>
            {item && item.length > 0 && item.map((val,i)=>{
                let key_id=`${val.item.slice(0,10)}_${i}`
                return(
                    <React.Fragment key={key_id}>
                    <Link href={`pr/${val.route}`} >
                        <div className=' aspect-square overflow-hidden bg-neutral-50'>

                        <div className=' '>
                        <Image src={check_Image(val.product_image)} width={100} height={100} alt={val.item_title} className=' h-full w-full object-contain object-center p-2  bg-transparent opacity-100'/>
                        </div>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <div className='w-[60%]'>
                            <h3 className='line-clamp-1 mt-1 text-[14px] font-semibold text-neutral-900'>{val.item}</h3>
                            <h5 className='mt-1 text-[14px] text-neutral-500'>{val.short_description}</h5>
                            </div>
                            <h1 className='mt-1 text-[14px] font-medium text-neutral-900'>{`$${val.price}`}</h1>
                        </div>
                        
                        </Link>
                        </React.Fragment>
                )
            })}
        </div>
    </div>
  )
}

export default ProductBox