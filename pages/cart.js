import { check_Image, delete_cart_items, get_cart_items } from '@/libs/api'
import { setCartItems } from '@/redux/slice/cartSettings'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Cart = () => {

    const cartValue = useSelector((state) => state.cartSettings.cartValue)
    const dispatch = useDispatch()
    const[remove,setRemove]= useState(true)
    let [cartItems, setCart] = useState(cartValue)

    useEffect(()=>{
        if(typeof window != 'undefined'){
            if(localStorage['customerRefId']){
                get_cart_item()
            }
        }

    },[])
    async function get_cart_item() {
        let res = await get_cart_items();
        if (res && res.message && res.message.status && res.message.status == "success") {
            dispatch(setCartItems(res.message));
        }
    }

    useMemo(()=>{
        setCart(cartValue)
    },[cartValue])

    // const RemoveItem=async(item)=>{
    //     if(item.name){

    //         setRemove(false)
    //     }
    //     let param = { name: item.name, customer: localStorage['customerRefId'] }
    //     const resp = await delete_cart_items(param);
    //     if (resp.message.status == 'success') {
    //       get_cart_item()
    //       setRemove(true)
    //     }
    // }

    const RemoveItem = async(item, index)=>{
       
        if(item.name){
          let removeingObj = [...cartItems.marketplace_items]
          removeingObj[index] = {
            ...removeingObj[index],
            remove: true
          }
         setCart(inv=>(
            console.log({...inv,marketplace_items:removeingObj}),
            {
                ...inv,
                marketplace_items:removeingObj

            }
         ));
        }
        let param = { name: item.name, customer: localStorage['customerRefId'] }
        const resp = await delete_cart_items(param);
        if (resp.message.status == 'success') {
          get_cart_item()
          setRemove(true)
        }

    }
    return (
        <div className='flex min-h-[calc(60dvh-64px)] flex-col'>
            <main className='flex-1'>
         
            {cartItems && cartItems.marketplace_items && cartItems.marketplace_items.length > 0 ? 
            <section className="mx-auto max-w-7xl p-8 pb-16">
               <h1 className='mt-8 text-3xl font-bold text-neutral-900'>
               Your Shopping Cart
               </h1>
               <ul className='mt-12 divide-y divide-neutral-200 border-b border-t border-neutral-200'>
                {cartItems.marketplace_items && cartItems.marketplace_items.length > 0 && cartItems.marketplace_items.map((item,i)=>{
                    let key_id=`${item.product_name}_${i}`
                    return(
                        <li className='flex py-4' key={key_id}>
                          <div className='aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-neutral-50 sm:h-32 sm:w-32'>
                            <Image src={check_Image(item.image)} width={200} height={200} alt={item.product_name}/>
                          </div>
                          <div className='relative flex flex-1 flex-col justify-between p-4 py-2'>
                            <div className='flex justify-between justify-items-start gap-4'>
                                
                                    <Link href={`/pr/${item.route}`} className='font-medium text-neutral-700'>{item.product_name}</Link>
                                    <p className='text-right font-semibold text-neutral-900'>{`$${item.price}`}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='text-sm font-bold'>Qty:{item.quantity}</p>
                                <button onClick={()=>RemoveItem(item, i)} className='text-sm text-neutral-500 hover:text-neutral-900'>{item.remove ? "Removing...":"Remove"}</button>
                            </div>
                            

                          </div>
                        </li>
                    )
                }) }
               </ul>
               <div className='mt-12'>
                <div className='rounded border bg-neutral-50 px-4 py-2'>
                     <div className='flex items-center justify-between gap-2 py-2'>
                        <div>
                            <h1 className='font-semibold text-neutral-900'>Your Total </h1>
                            <p className='mt-1 text-sm text-neutral-500'>Shipping will be calculated in the next step</p>
                        </div>
                        <p className='font-medium text-neutral-900'>${cartValue.total}</p>
                     </div>
                     </div>
                     <div className='mt-10 text-center'>
                        <Link data-testid="CheckoutLink" aria-disabled="false" href={"/checkout"} className='inline-block max-w-full rounded border border-transparent bg-neutral-900 px-6 py-3 text-center font-medium text-neutral-50 hover:bg-neutral-800 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-500 sm:px-16 w-full sm:w-1/3'>Checkout</Link>
                     </div>
               </div>
            </section> 
            : 
            <section className='mx-auto max-w-7xl p-8'>
                  <h1 className='mt-8 text-3xl font-bold text-neutral-900'>Your Shopping Cart is empty</h1>
                  <p className='my-12 text-sm text-neutral-500'>Looks like you haven’t added any items to the cart yet.</p>

                  <Link href={"/"} className='inline-block max-w-full rounded border border-transparent bg-neutral-900 px-6 py-3 text-center font-medium text-neutral-50 hover:bg-neutral-800 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-500 sm:px-16'>Explore products</Link>
            </section>
            }
   
            </main>

      
     
        </div>
    )
}

export default Cart