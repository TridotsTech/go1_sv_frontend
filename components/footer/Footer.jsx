import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const Footer = () => {
    const router=useRouter()
  return (
    <div className={`${router.asPath.includes("/checkout")? "md:hidden":""} border-neutral-300 bg-neutral-50 `}>
        <div className='mx-auto max-w-8xl px-4 lg:px-8'>
            <div className='grid grid-cols-3 gap-8 py-16'>
                <div>
                    <h1 className='text-[14px] font-semibold text-neutral-900'>Go1</h1>
                    <ul className='mt-4 space-y-4 [&>li]:text-neutral-500'>
                        <li className='text-[14px]'>About</li>
                        <li className='text-[14px]'>Contact us</li>
                    </ul>
                </div>

                <div>
                    <h1 className='text-[14px] font-semibold text-neutral-900'>Categories</h1>
                    <ul className='mt-4 space-y-4 [&>li]:text-neutral-500'>
                    <li className='text-[14px]'><Link href={'all-category/apparel'} className=''>Apparel</Link></li>
                    <li className='text-[14px]'><Link href={'all-category/accessories'} className=''>Accessories</Link></li>
                    </ul>
                </div>

            </div>
            <div className='mb-4 text-neutral-500'>
                <label>
                    <span>Change Currency:  </span>
                    <select className='h-10 w-fit rounded-md border border-neutral-300 bg-transparent bg-white px-4 py-2 pr-10 text-sm  placeholder:text-neutral-500 focus:border-black focus:ring-black'>
                        <option value="aud">AUD</option>
                        <option value="brl">BRL</option>
                        <option value="cad">CAD</option>
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                        <option value="gbp">GBP</option>
                        <option value="inr">INR</option>
                    </select>
                </label>

            </div>
            <div className='flex flex-col justify-between items-center py-10 border-t border-neutral-200 sm:flex-row'>
                <p className='text-sm text-neutral-500'>Copyright © 2024 Your Store, Inc. </p>
                <p className='flex gap-1 items-center text-sm text-neutral-500'>Powered by <Link href={"/"}>Go1</Link><Link href={"/"}><Image src={"/github-mark.svg"} height={20} width={20} alt='githubmark'/></Link></p>
            </div>
        </div>

    </div>
  )
}

export default Footer