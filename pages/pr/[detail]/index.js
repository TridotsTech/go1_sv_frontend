import { check_Image, delete_cart_items, get_cart_items, get_product_detail, getCurrentUrl, insert_cart_items, seo_Image, update_cartitem, validate_attributes_stock } from '@/libs/api'
import { setCartItems } from '@/redux/slice/cartSettings'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Head from 'next/head'
import { toast } from 'react-toastify';

const Detail = ({ productDetail }) => {
    console.log(productDetail, "productDetail")
    const cartItems = useSelector((state) => state.cartSettings.cartItems)
    const cartValue = useSelector((state) => state.cartSettings.cartValue)
    let [data, setData] = useState();
    const router = useRouter();
    const [variantStockMsg, setVariantStockMsg] = useState()
    let [sample, setSample] = useState(1);
    const [varActive, setVarActive] = useState(0);
    const dispatch = useDispatch()
    let [additionalInfo, setAdditionalInfo] = useState({});
    let[loader,setLoader]=useState(true)

    useEffect(() => {
        if (typeof window != 'undefined') {
            // setApicall(true)
            // setLoader(true);
            setData(productDetail);
            // setLoader(false);
            get_product_details();
        }
    }, [router.query])

    useEffect(()=>{
        if(typeof window != 'undefined'){
            if(localStorage['customerRefId']){
                get_cart_item()
            }
        }

    },[])

    const productQty = (data) => {
        if (data) {
            if (cartItems && cartItems.length != 0) {
                for (let i = 0; i < cartItems.length; i++) {

                    if (data['has_variants'] == 1 && data['attribute_id'] == cartItems[i]['attribute_ids'] && data['business'] == cartItems[i]['business']) {
                        data['attribute_id'] = cartItems[i]['attribute_ids']
                        data['attribute'] = cartItems[i]['attribute']
                        // data['price'] = cartItems[i]['price']
                        // data['old_price'] = cartItems[i]['old_price']
                        data['quantity'] = cartItems[i]['quantity']
                        data['count'] = cartItems[i]['quantity']
                        data['cart_id'] = cartItems[i]['cart_id']
                        data['business'] = cartItems[i]['business']
                        // setData(data)
                        break;
                    } else if (data['has_variants'] == 0 && data['name'] == cartItems[i]['product'] && data['business'] == cartItems[i]['business']) {
                        // data['price'] = cartItems[i]['price']
                        // data['old_price'] = cartItems[i]['old_price']
                        data['quantity'] = cartItems[i]['quantity']
                        data['count'] = cartItems[i]['quantity']
                        data['cart_id'] = cartItems[i]['cart_id']
                        data['business'] = cartItems[i]['business']
                        // setData(data)
                        break;

                    } else {
                        data['quantity'] = 0
                        data['count'] = 0
                        // setData(data)
                    }
                }
            } else {
                data['quantity'] = 0
                data['count'] = 0
            }

            validate_attributes_stock_check(data)

        }
    }
    const validate_attributes_stock_check = async (value) => {
        // console.log('dasdas',value)
        let param = {
            "attribute_id": value.attribute_id ? value.attribute_id : '',
            "business": value.business ? value.business : '',
            'cart_qty': value.count,
            "product": value.name,
            "customer": localStorage['customerRefId'],
            "variant_html": "",
        }
        let res = await validate_attributes_stock(param)
        if (res && res.message && res.message.status && res.message.status == 'Success') {
            setVariantStockMsg()
            data['price'] = res.message.price
            data['old_price'] = res.message.old_price
            data['stock'] = res.message.stock
            data['discount_percentage'] = res.message.discount_percentage
        } else {
            setVariantStockMsg(res.message.message)
        }


        setData(data)
        setSample(sample + 1)
    }

    const get_product_details = async () => {
        if (productDetail.status && productDetail.status == 'Failed') {
            router.push('/404');
        } else {
            // let productDetail = resp.message
            if (productDetail) {

                if ((productDetail.vendor_price_list && productDetail.vendor_price_list.length != 0 && productDetail.vendor_price_list[0])) {
                    if (productDetail.has_variants == 1) {

                        if (productDetail.vendor_price_list[0].default_variant) {
                            let val = productDetail.vendor_price_list[0].variants.findIndex((res) => { return res.attribute_id == productDetail.vendor_price_list[0].default_variant.attribute_id })
                            setVarActive(val)
                            productDetail['price'] = productDetail.vendor_price_list[0].variants[val].product_price
                            productDetail['old_price'] = productDetail.vendor_price_list[0].variants[val].old_price
                            productDetail['discount_percentage'] = productDetail.vendor_price_list[0].variants[val].discount_percentage
                            productDetail['attribute'] = productDetail.vendor_price_list[0].variants[val].variant_text
                            productDetail['attribute_id'] = productDetail.vendor_price_list[0].variants[val].attribute_id
                            productDetail['business'] = productDetail.vendor_price_list[0].business
                            productDetail['stock'] = productDetail.vendor_price_list[0].variants[val].stock
                            productDetail['count'] = 0;
                        }

                        // console.log(productDetail,'productDetail')

                        if (productDetail.product_video && productDetail.product_video.length != 0) {
                            productDetail.images = [...productDetail.images, ...productDetail.product_video]
                        }

                        productDetail.mainImages = productDetail.images
                        productDetail['count'] = 0;
                        productDetail['business'] = productDetail.vendor_price_list[0].business
                        // checkVariantInfo(productDetail)

                    } else {
                        productDetail['count'] = 0;
                        productDetail['price'] = productDetail.vendor_price_list[0].product_price
                        productDetail['old_price'] = productDetail.vendor_price_list[0].old_price
                        productDetail['discount_percentage'] = productDetail.vendor_price_list[0].discount_percentage
                        productDetail['business'] = productDetail.vendor_price_list[0].business
                        productDetail['stock'] = productDetail.vendor_price_list[0].stock
                        productQty(productDetail)
                    }
                } else {
                    productQty(productDetail)
                }
                // data = productDetail
                data = { ...productDetail, ...additionalInfo }
                setData(data);
                // setData((data)=> data = data)
                // setDataSample(data)
                // productQty(data)
                // let obj = resp.message['full_description'] ? { title: 'Product Detail', content: resp.message['full_description'] };

                // setTimeout(() => {
                //     setIndexImage(imageIndex + 1);
                // }, 200);
            }

            // setLoader(false)
            // loadLightGallery()
        }
    }

    useMemo(() => {
        if (cartValue && cartValue.name) {
            get_product_details()
        }
    }, [cartValue])

    function addCart(value, index, type) {

        // console.log(value,'value')
        // console.log(text_btn,'text_btn')
        // console.log(quickView,'quickView')
        setLoader(false)
        if ((value.has_variants == 1 && !text_btn) || (value.has_variants == 1 && quickView)) {
            variantOpen(value)
            // setVariantItems(value);
        } else if (value.has_variants == 1 && text_btn) {
            let is_required = value.product_attributes.filter(res => { return res.is_required == 'Yes' })
            if (is_required.length == 0) {
                addTOCart(index, value, type)
            } else {

                let is_pre_selected = 0
                is_required.map((res, i) => {
                    let find = res.options.find(r => { return r.is_pre_selected == 1 })
                    if (find && (i == is_pre_selected)) {
                        is_pre_selected++;
                    }
                    // res.options.map(r=>{
                    //   r.is_pre_selected == 1 ? is_pre_selected++ : 0
                    // })
                })
                if (is_pre_selected == is_required.length) {
                    addTOCart(index, value, type)
                } else {
                    toast.error('Please select the ' + is_required[is_pre_selected].attribute);
                }

            }
        } else {
            addTOCart(index, value, type)
            
        }
    }
    function addTOCart(index, value, type) {

        // setLoader(index)
        if (value['count'] == 0) {
            insert_cart(value, 'buy_now')
        } else {
            updateCart(value, type)
        }
    }
    const updateCart = async (dataValue, type) => {
        if (type == 'dec' && (dataValue['count'] == 1 || (dataValue.minimum_order_qty && dataValue.minimum_order_qty == dataValue['count']))) {
          let param = { name: dataValue.cart_id, customer_id: localStorage['customerRefId'] }
          const resp = await delete_cart_items(param);
        //   setTimeout(() => { setLoader(-1) }, 500)
          if (resp.message.status == 'success') {
            // setTimeout(() => { setLoader(-1) }, 500)
            get_cart_item()
          }
        } else if (dataValue['count'] > 0) {
          update_cart(dataValue, type);
        }else{
          update_cart(dataValue, type);
        }
    
      }
    
      async function update_cart(dataValue, type) {
        // console.log('dataValue',dataValue);
    
        let param = {
          name: dataValue.cart_id,
          qty: type == 'inc' ? (dataValue['count'] + 1) : (dataValue['count'] - 1),
          "business": dataValue.business ? dataValue.business : '',
          qty_type: ""
        }
    
        const resp = await update_cartitem(param);
        // setTimeout(() => { setLoader(-1) }, 500)
        if (resp.message.status == 'success') {
          get_cart_item()
          UpdateSuccessToast(dataValue)
        } else {
          let msg = (resp.message && resp.message.message) ? resp.message.message : 'Something went wrong try again later'
          toast.error(msg);
        }
      }

      function UpdateSuccessToast(value) {
        let item = value.item || value.product_name
        toast.success(item + ' updated successfully')
      }
    
      function successToast(value) {
        let item = value.item || value.product_name
        toast.success(item + ' added successfully')
      }

    async function insert_cart(value, type) {
        value.variant_text = value.attribute ? value.attribute : value.variant_text
        let param = {
            "item_code": value.name,
            "qty": value.minimum_order_qty ? value.minimum_order_qty : 1,
            "qty_type": "",
            "cart_type": "Shopping Cart",
            "customer": localStorage['customerRefId'],
            // "attribute": value.attribute ? value.attribute : '',
            "attribute": value.variant_text ? value.variant_text : '',
            "attribute_id": value.attribute_id ? value.attribute_id : '',
            "business": value.business ? value.business : ''
        }

        const resp = await insert_cart_items(param);
        // setTimeout(() => { setLoader(-1) }, 500)
        if (resp.message && resp.message.marketplace_items) {
            localStorage['customerRefId'] = resp.message.customer
            get_cart_item()
            successToast(value)
        } else {
            let msg = (resp.message && resp.message.message) ? resp.message.message : 'Something went wrong try again later'
            toast.error(msg);
        }
    }

    async function get_cart_item() {
        let res = await get_cart_items();
        if (res && res.message && res.message.status && res.message.status == "success") {
            dispatch(setCartItems(res.message));
            setLoader(true)
        }
    }

    return (
        <>
    
        <Head>
        <title>{productDetail?.meta_title}</title>
        <meta name="description" content={productDetail?.meta_description} />
        <meta property="og:type" content={'Blog'} />
        <meta property="og:title" content={productDetail?.meta_title} />
        <meta key="og_description" property="og:description" content={productDetail?.meta_description} />
        <meta property="og:image" content={seo_Image(productDetail?.meta_image)}></meta>
        <meta property="og:url" content={getCurrentUrl(router.asPath)}></meta>
        <meta name="twitter:image" content={seo_Image(productDetail?.meta_image)}></meta>
        <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/1.6.12/css/lightgallery.min.css"/>
        <script defer src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/lightgallery@1.6.12/dist/js/lightgallery.min.js"></script>
      </Head>

        <section className="mx-auto max-w-7xl p-8 pb-16">
         
            <div className='grid lg:grid-cols-8'>
                <div className='lg:col-span-5 '>
                    <div className='aspect-square overflow-hidden bg-neutral-50'>
                        <div>
                            <Image src={check_Image(data?.images[0]?.product_image)} width={1024} height={1024} alt={data?.search_words} className=' h-full w-full object-contain object-center p-2  ' />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col pt-6 sm:col-span-1 sm:px-6 sm:pt-0 lg:col-span-3 lg:pt-16'>
                    <div>
                        <h1 className='mb-4 flex-auto text-3xl font-medium tracking-tight text-neutral-900'>{data?.item}</h1>
                        {data?.stock > 0 ? <p className='mb-8'>{`$${data?.price}`}</p> : <div className='my-6 flex items-center'><Image src={"/cancel.svg"} width={15} height={15} alt='cancel' /><p className='ml-1 text-base font-semibold text-neutral-500'>Out of stock</p></div>}

                        {loader ? <button aria-disabled="true" aria-busy="false" onClick={() => data && data?.stock == 0?null:addCart(data, varActive, 'inc')} className={`h-12 mb-8 items-center rounded-md  px-6 py-3 text-base font-medium leading-6 text-white shadow ${data && data?.stock > 0 ? "bg-neutral-900 hover:bg-neutral-800" : "bg-neutral-900 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"} `}>Add to cart</button>:<button aria-disabled="true" aria-busy="true" className='h-12 mb-8 items-center rounded-md  px-6 py-3 text-base font-medium leading-6 text-white shadow  bg-neutral-900 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700'>Processing...</button>}
                        <p className='space-y-6 text-sm text-neutral-500' dangerouslySetInnerHTML={{ __html: data?.full_description }}></p>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

export default Detail

export async function getServerSideProps(context) {
    let { detail } = context.params;
    if (detail && detail.includes('?')) {
        let data = detail.split('?')
        detail = data[0]
    }

    let data = { route: detail, centre: "" }

    const resp = await get_product_detail(data);

    let productDetail = resp.message;
    if (resp.message.images && resp.message.images.length != 0) {
        productDetail.meta_image = resp.message.images[0].detail_image
    }

    return {
        props: { productDetail }
    }
}