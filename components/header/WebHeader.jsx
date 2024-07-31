import { get_cart_items } from '@/libs/api'
import { setCartItems } from '@/redux/slice/cartSettings'
import { setWebSetting } from '@/redux/slice/websiteSettings'
import Image from 'next/image'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import AuthModal from '../Auth/AuthModal'
import dynamic from 'next/dynamic';
const AuthModal = dynamic(() => import('../Auth/AuthModal'), { ssr: false });

const WebHeader = ({ website_settings }) => {
    const router = useRouter()
    const cartCount = useSelector((state) => state.cartSettings.cartCount)
    const cartItems = useSelector((state) => state.cartSettings.cartItems)
    const totalqty = useSelector((state) => state.cartSettings.totalqty)
    const [trues, setTrue] = useState(false)
    let [searchVal, setSearchVal] = useState("")
    let [websiteSettings, set_website_settings] = useState();
    let [staticMenu, setStaticMenu] = useState([]);
    let [visibleLogin, setVisibleLogin] = useState(false)
    const loginInfo = useSelector((state) => state.logInInfo.customerInfo)
    const [customerName, setCustomerName] = useState()
    
    

    const dispatch = useDispatch()

    useEffect(() => {
        if (typeof window != 'undefined') {
            if (localStorage['customerRefId']) {
                get_cart_item()
            }
        }

    }, [])

    useMemo(() => {

        if (website_settings) {
          websiteSettings = website_settings
          set_website_settings(websiteSettings)
          dispatch(setWebSetting(websiteSettings));
          if (websiteSettings.default_header && websiteSettings.default_header.items && websiteSettings.default_header.items.length != 0) {
            let menu = websiteSettings.default_header.items.find(r => { return r.section_type == 'Menu' && r.section_name == 'Header Menu' })
            if (menu) {
              staticMenu = menu.menus
              setStaticMenu(staticMenu)
            }
          }
        }
    
      }, [website_settings])

      useEffect(() => {
        if(typeof window !== "undefined" ){

            if ((loginInfo && loginInfo.full_name) || localStorage['CustomerName']) {
              setCustomerName(localStorage['CustomerName'])
              get_cart_item()
            } else {
              setCustomerName()
            }
        }
    
      }, [loginInfo])

    useMemo(() => {

    }, [cartCount, totalqty])

    async function get_cart_item() {
        let res = await get_cart_items();
        if (res && res.message && res.message.status && res.message.status == "success") {
            dispatch(setCartItems(res.message));
        }
    }
    const handleClick = () => {
        console.log(searchVal,"searchVal")
        if (searchVal) {

            router.push(`/search?query=${searchVal}`)
        }

    }
    const handleChange = (e) => {
        searchVal = e.target.value
        //  console.log(Se)
        setSearchVal(searchVal)
    }

    const handleMenu = () => {
        console.log(trues)
        if (!trues) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }

    useEffect(()=>{
        if(typeof window != undefined){

            setTrue(false)
            document.body.style.overflow = "auto"
        }
    //   handleMenu()
    },[router])
    // useMemo(()=>{

    // },[trues])

    const handleProfile=()=>{

        if(localStorage["CustomerId"]){
            router.push("/profile?my_account=edit-profile")
        }else{
            setVisibleLogin(true)
        }

    }

    const hideLogin = () => {
        setVisibleLogin(false);
      }
    return (
        <>
         {visibleLogin && <AuthModal visible={visibleLogin} hide={hideLogin} />}

            {!trues ?
                <header className='sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md'>
                    <div className='mx-auto max-w-8xl px-8 '>
                        <div className='flex h-16 justify-between gap-4 md:gap-8'>
                            <div className='font-bold flex gap-10 items-center text-[24px]'>
                                <Link  href="/" className="text-[24px] font-bold">
                                    Go1
                                </Link>
                                <ul className=' [&>li]:text-neutral-500 gap-10 md:hidden flex'>
                                    <li className='text-[14px]'><Link href={'/all-category/apparel'} className='border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-[14px] font-medium hover:text-neutral-700'>Apparel</Link></li>
                                    <li className='text-[14px]'><Link href={'/all-category/accessories'} className='border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-[14px] font-medium hover:text-neutral-700'>Accessories</Link></li>
                                </ul>
                            </div>
                            <div className='flex items-center justify-between gap-8'>
                                <div className='relative  items-center md:hidden lg:flex   '>
                                    <input placeholder='Search for product...' className='h-[40px] pl-[16px] pr-[40px] py-[8px] text-[14px] rounded-md w-[20rem] border-[#d4d4d4] ' onChange={(e) => handleChange(e)} />
                                    <div className='absolute right-0 w-[30px]  ' onClick={ handleClick }>
                                        <Image src={"/search.svg"} width={20} height={20} alt='search' />
                                    </div>
                                </div>
                                
                                <div onClick={handleProfile} className='flex flex-col items-center md:hidden '>
                                    <Image src={"/profile.svg"} width={25} height={25} alt='profile' />
                                    {customerName && <p className='md:hidden'>{customerName}</p>}
                                </div>
                                <div className='relative' onClick={() => router.push("/cart")}>
                                    <Image src={"/shopping.svg"} width={25} height={25} alt='profile' />
                                    <p className='absolute rounded bottom-0 right-0 bg-neutral-900 -mb-2 -mr-2 text-white h-4 w-[15px]  flex flex-col items-center justify-center text-xs'>{totalqty}</p>
                                </div>
                                <div className='md:block lg:hidden' onClick={() => { setTrue(true), handleMenu() }}>
                                    <Image src={"/menu.svg"} width={25} height={25} alt='menu' />
                                </div>
                            </div>
                        </div>
                    </div>
                </header> : 
                <header className='sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md'>
                    <div className='mx-auto max-w-7xl px-3 lg:px-9 relative'>
                        <div className='flex h-16 justify-between gap-4 md:gap-8'>
                            <div className='font-bold flex gap-10 items-center text-[24px]'>
                                <Link className='text-[24px] font-bold' href="/" >
                                    Go1
                                </Link>

                            </div>
                            <div className='flex items-center justify-between gap-4'>
                             

                                <div className='' onClick={() => { setTrue(false), handleMenu() }}>
                                    <Image src={"/cancel.svg"} width={25} height={25} alt='menu' />
                                </div>


                            </div>
                        </div>
                        <div className='flex flex-col w-[93%] absolute top-[70px] transition ease-in-out duration-300 divide-y divide-neutral-200 whitespace-nowrap'>
                        <div className='relative  items-center flex  mb-[10px] w-[100%] '>
                                    <input placeholder='Search for product...' className='h-[40px] w-[100%] pl-[16px] border pr-[40px] py-[8px] text-[14px] rounded-md border-[#d4d4d4] ' onChange={(e) => handleChange(e)} />
                                    <div className='absolute right-0 w-[30px]  ' onClick={ handleClick}>
                                        <Image src={"/search.svg"} width={20} height={20} alt='search' />
                                    </div>
                                </div>
                            <ul className=' [&>li]:text-neutral-500 gap-10  md:flex md:flex-col [&>li]:py-3 divide-y divide-neutral-200 whitespace-nowrap'>
                                <li className='text-sm'><Link href={'/all-category/apparel'} className='border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700'>Apparel</Link></li>
                                <li className='text-sm'><Link href={'/all-category/accessories'} className='border-transparent text-neutral-500 inline-flex items-center border-b-2 pt-px text-sm font-medium hover:text-neutral-700'>Accessories</Link></li>
                            </ul>
                        </div>
                    </div>
                </header>}

        </>
    )
}

export default WebHeader