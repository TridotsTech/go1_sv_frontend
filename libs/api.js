// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import { domain, website } from "./config/siteConfig"

const methodUrl = `https://${domain}/api/method/`;
const resourceUrl = `https://${domain}/api/resource/`;
const domainUrl = domain;

const apiUrl_common = 'ecommerce_business_store.ecommerce_business_store.v2.common.'
const apiUrl_carts = 'ecommerce_business_store.ecommerce_business_store.v2.cart.'
const apiUrl_customer = 'ecommerce_business_store.ecommerce_business_store.v2.customer.'
const apiUrl_product = 'ecommerce_business_store.ecommerce_business_store.v2.product.'
const apiUrl_category = 'ecommerce_business_store.ecommerce_business_store.v2.category.'
const apiUrl_checkout = 'ecommerce_business_store.ecommerce_business_store.v2.checkout.'
const apiUrl_orders = 'ecommerce_business_store.ecommerce_business_store.v2.orders.'
const apiUrl_vendors = 'ecommerce_business_store.ecommerce_business_store.v2.vendor.'
const apiUrl_masters = 'ecommerce_business_store.ecommerce_business_store.v2.masters.'
const apiUrl_mobileapi = 'ecommerce_business_store.ecommerce_business_store.mobileapi.'
const app_name = 'Go1Market';
let razorpay_settings;
let r_pay_color = '#e21b22';

export const checkMobile = () => {
    if (window.innerWidth < 767) {
        return true;
    } else if (window.innerWidth > 767) {
        return false;
    }
}

export const currencyFormatter1 = (amount, currencyCode = 'INR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
});

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export async function check_count(quantity, type) {
    let count = quantity
    if (type == 'inc') {
        count = quantity + 1;
    } else if (type == 'dec') {
        count = quantity - 1;
    }
    return count;
}

export function stored_customer_info() {
    let users = {}
    users.cust_email = localStorage['customerUser_id'] ? localStorage['customerUser_id'] : undefined;
    users.user_id = localStorage['customerUser_id'] ? localStorage['customerUser_id'] : undefined;
    users.cust_name = localStorage['CustomerName'] ? localStorage['CustomerName'] : undefined;
    users.customer_id = localStorage['customerRefId'] ? localStorage['customerRefId'] : undefined;

    users.address = localStorage['address'] ? localStorage['address'] : undefined;
    users.city = localStorage['city'] ? localStorage['city'] : undefined;
    users.state = localStorage['state'] ? localStorage['state'] : undefined;
    users.country = localStorage['country'] ? localStorage['country'] : undefined;
    users.zipcode = localStorage['zipcode'] ? localStorage['zipcode'] : undefined;
    users.business = localStorage['business'] ? localStorage['business'] : undefined;
    return users;
}

export function stored_locations_info(location) {
    if(location.business){
        localStorage['business'] = location.business
    }
    localStorage['address'] = location.address ? location.address : undefined;
    localStorage['city'] = location.city ? location.city : undefined;
    localStorage['state'] = location.state ? location.state : undefined;
    localStorage['country'] = location.country ? location.country : undefined;
    localStorage['zipcode'] = location.zipcode ? location.zipcode : undefined;
}

export function storeCustomerInfo (resp) {
    localStorage['CustomerId'] = resp.message[0].email;
    localStorage['email'] = resp.message[0].email;
    localStorage['CustomerName'] = resp.message[0].full_name;
    localStorage['referral_code'] = resp.message[0].referral_code
    localStorage['Customerphone'] = resp.message[0].phone;
    localStorage['Customerfirst_name'] = resp.message[0].first_name
    localStorage['Customerlast_name'] = resp.message[0].last_name
    localStorage['customerRefId'] = resp.message[0].name
    localStorage['customerUser_id'] = resp.message[0].user_id;
    let business_addr_info = {};
    business_addr_info.business_name = resp.message[0].business_name
    business_addr_info.business_phone = resp.message[0].business_phone
    business_addr_info.business_address = resp.message[0].business_address
    business_addr_info.business_landmark = resp.message[0].business_landmark
    business_addr_info.business_city = resp.message[0].business_city
    business_addr_info.business_state = resp.message[0].business_state
    business_addr_info.business_zip = resp.message[0].business_zip
    business_addr_info.business_country = resp.message[0].business_country
    localStorage['Business_address'] = JSON.stringify(business_addr_info);
    localStorage.removeItem('guestRefId');
}

export const check_Image = (Image) => {
    let baseUrl = `https://${domain}`
    if (Image && Image != '') {
        if (Image.indexOf('https') == -1) {
            return baseUrl + Image;
        } else if (Image.indexOf('https') == 0) {
            return Image;
        }
    } else {
        return '/empty-state.png'
    }
}

export const seo_Image = (Image) => {
    let baseUrl = `https://${domain}`
    if (Image) {
        if (Image.indexOf('https') == -1) {
            return baseUrl + Image;
        } else if (Image.indexOf('https') == 0) {
            return Image;
        }
    } else {
        return website + '/empty-state.png'
    }
}

export const getCurrentUrl = (URl) => {
    return website + URl
}

export function getColor(value) {
    if (value == 'Paid' || value == 'success' || value == 'Active' || value == 'Completed' ||value == "Debited") {
        return '#037D00'
    } else if (value == 'Pending' || value == 'Cancelled') {
        return '#ff0000a3'
    } else if (value == 'Unpaid') {
        return '#E1590D'
    } else if (value == 'Shipped' || value == 'Placed') {
        return '#e0d9cec2'
    } else if (value == 'Order Delivered') {
        return '#02b290'
    } else if (value == 'Pending') {
        return '#ff0000a3'
    }else if(value == 'Credited'){
        return '#FFA500'
    }
     else {
        return '#ddd'
    }
}


export async function get_razorpay_settings() {
    const resp = await get_razorpaysetting();
    if (resp && resp.message) {
        return razorpay_settings = resp.message;
    }
}

export async function checkCart(id, array) {
    var cnt = 0;
    array = [...array.marketplace_items, ...array.fl_items];
    array.find(res => { if (res.product == id && res.is_free_item != 1) { cnt += res.quantity } })
    return cnt;
}

export async function postMethod(api, payload) {
    try{
    let apikey;
    let secret;
    if (typeof window !== 'undefined') {
        apikey = localStorage['api_key'] ? localStorage['api_key'] : undefined;
        secret = localStorage['api_secret'] ? localStorage['api_secret'] : undefined;
    }
    const myHead = new Headers((apikey && secret) ? { "Authorization": 'token ' + apikey + ':' + secret, "Content-Type": "application/json" } : { "Content-Type": "application/json"})
    const response = await fetch(api, { method: 'POST', headers: myHead, body: JSON.stringify(payload) })
    const data = await response.json();
    return data
}
    catch(error){
        // return error.message
        // toast.error(error.message)
    }
}


export async function get(api) {
    let apikey;
    let secret;
    if (typeof window !== 'undefined') {
        apikey = localStorage['api_key'] ? localStorage['api_key'] : undefined;
        secret = localStorage['api_secret'] ? localStorage['api_secret'] : undefined;
    }

    const myHead = new Headers((apikey && secret) ? { "Authorization": 'token ' + apikey + ':' + secret, "Content-Type": "application/json"} : { "Content-Type": "application/json" })
    const response = await fetch(api, { method: 'GET', headers: myHead })
    const data = await response.json();
    return data;
}



export async function HomePage(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.common.get_page_content_with_pagination';
    return await postMethod(api, data)
}

export async function BlogList(data){
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.common.get_blog_list';
    return await postMethod(api, data)

}

export async function blog_details(data){
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.common.get_blog_details';
    return await postMethod(api, data)

}

export async function post_comments(data){
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.common.insert_blog_comments';
    return await postMethod(api, data)

}


export async function BlogCategories(){
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.common.get_blog_categories';
    return await get(api)
}


export async function websiteSettings() {
    let api = methodUrl + apiUrl_common + 'get_all_website_settings';
    return await get(api)
}

export async function getDashBoardData(){
    let api =methodUrl+'ecommerce_business_store.ecommerce_business_store.v2.customer.get_customer_dashboard'
    return await get(api)
}

export async function forgetPassword(data) {
    let api = methodUrl + apiUrl_common + 'send_user_forget_pwd_mail';
    return await postMethod(api, data)
}

export async function get_category_products(data) {
    // this.website_settings.enable_multi_store == 1 ? data.business = this.businessId : null;
    let api = methodUrl + apiUrl_product + 'get_category_products';
    return await postMethod(api, data)
}

export async function get_product_detail(data) {
    let api = methodUrl + apiUrl_product + 'get_product_details';
    return await postMethod(api, data)
}

export async function get_product_other_info(data) {
    let api = methodUrl + apiUrl_product + 'get_product_other_info';
    return await postMethod(api, data)
}

export async function get_product_reviews_list(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.doctype.product.product.get_product_reviews_list';
    return await postMethod(api, data)
}

export async function get_product_enquiries(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.mobileapi.get_product_enquiries';
    return await postMethod(api, data)
}



export async function get_cart_items() {
    let data = {"customer_id": localStorage['customerRefId'] }
    let api = methodUrl + apiUrl_carts + 'get_cart_items';
    return await postMethod(api, data)
    // return await get(api)
}

export async function insert_cart_items(data) {
    let api = methodUrl + apiUrl_carts + 'insert_cart_items';
    return await postMethod(api, data)
}

export async function update_cartitem(data) {
    let api = methodUrl + apiUrl_carts + 'update_cartitem';
    return await postMethod(api, data)
}

export async function delete_cart_items(data) {
    let api = methodUrl + apiUrl_carts + 'delete_cart_items';
    return await postMethod(api, data)
}

export async function move_item_to_cart(data) {
    let api = methodUrl + apiUrl_carts + 'move_item_to_cart';
    return await postMethod(api, data)
}

export async function move_all_tocart(data) {
    let api = methodUrl + apiUrl_carts + 'move_all_tocart';
    return await postMethod(api, data)
}

export async function clear_cartitem(data) {
    let api = methodUrl + apiUrl_carts + 'clear_cartitem';
    return await postMethod(api, data)
}

export async function validate_attributes_stock(data) {
    let api = methodUrl + apiUrl_carts + 'validate_attributes_stock';
    return await postMethod(api, data)
}

export async function get_category_filters(data) {
    let api = methodUrl + apiUrl_category + 'get_category_filters';
    return await postMethod(api, data)
}

export async function get_customer_info(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.get_customer_info';
    return await postMethod(api, data)
}

export async function get_customer_order_list(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.customer.get_customer_order_list'
    return await postMethod(api, data)
}



export async function get_order_info(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.customer.get_order_info'
    return await postMethod(api, data)
}

export async function update_password(data) {
    let api = methodUrl + apiUrl_customer + 'update_password';
    // let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.update_password'
    return await postMethod(api, data)
}

export async function update_order_status(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.mobileapi.update_order_status'
    return await postMethod(api, data)
}

export async function get_payment_method() {
    let data = { domain: domainUrl }
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.get_payment_method';
    return await postMethod(api, data)
}

export async function delete_address(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.delete_address'
    return await postMethod(api, data)
}

export async function get_shipping_methods(data) {
    let api = methodUrl + apiUrl_checkout + 'get_shipping_methods'
    return await postMethod(api, data)
}

export async function get_cart_delivery_slots(data) {
    let api = methodUrl + apiUrl_checkout + 'get_cart_delivery_slots'
    return await postMethod(api, data)
}

export async function insert_address(data) {
    let datas = { data: JSON.stringify(data) }
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.insert_address'
    return await postMethod(api, datas)
}

export async function update_address(data) {
    let datas = { data: JSON.stringify(data) }
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.update_address'
    return await postMethod(api, datas)
}

export async function insertOrder(data) {
    let datas = { data: JSON.stringify(data) }
    // let api =  methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.insert_order'
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.v2.orders.insert_order'
    return await postMethod(api, datas)
}


export async function get_razorpaysetting(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.razor_pay_settings'
    return await get(api)
}

export async function get_country_list() {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.mobileapi.get_country_list';
    return await get(api)
}

export async function get_country_states(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.get_country_states?country=' + data;
    return await get(api)
}

export async function get_transaction_details(data){
    let api = methodUrl+'ecommerce_business_store.accounts.api.get_wallet_details'
    return await postMethod(api,data)
}

export async function get_wallet_details() {
    let api = methodUrl + apiUrl_customer + 'get_wallet_details';
    return await get(api)
}

export async function login(data) {
    let api = methodUrl + apiUrl_customer + 'login';
    return await postMethod(api, data)
}

export async function social_login(data) {
    let api = methodUrl + "ecommerce_business_store.ecommerce_business_store.mobileapi.social_login_customer"
    return await postMethod(api, data)
}

export async function send_otp(data) {
    let api = methodUrl + apiUrl_customer + 'send_otp';
    return await postMethod(api, data)
}

export async function verify_otp(data) {
    let api = methodUrl + apiUrl_customer + 'verify_otp';
    return await postMethod(api, data)
}

export async function registerUser(datas) {
    let data = { data: JSON.stringify(datas) }
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.mobileapi.insert_customers'
    return await postMethod(api, data)
}

export async function update_doc(datas) {
    let data = { doc: JSON.stringify(datas) }
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.mobileapi.update_doc'
    return await postMethod(api, data)
}

export async function calculate_shipping_charges(data) {
    let api = methodUrl + apiUrl_checkout + 'calculate_shipping_charges'
    return await postMethod(api, data)
}

export async function validate_coupon(data) {
    let api = methodUrl + apiUrl_checkout + 'validate_coupon'
    return await postMethod(api, data)
}

export async function get_order_discount(data) {
    let api = methodUrl + apiUrl_checkout + 'get_order_discount'
    return await postMethod(api, data)
}

export async function insert_review(data) {
    let api = methodUrl + apiUrl_product + 'insert_review'
    return await postMethod(api, data)
}

export async function insert_questionaproduct(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.insert_questionaproduct'
    return await postMethod(api, data)
}

export async function get_vendor_details(data) {
    let api = methodUrl + apiUrl_product + 'get_vendor_details'
    return await postMethod(api, data)
}

export async function reorder(data) {
    let api = methodUrl + apiUrl_orders + 'reorder'
    return await postMethod(api, data)
}

export async function cancel_order(data) {
    let api = methodUrl + apiUrl_customer + 'cancel_order'
    return await postMethod(api, data)
}

export async function create_return_request(data) {
    let api = methodUrl + apiUrl_orders + 'create_return_request'
    return await postMethod(api, data)
}

export async function get_return_request_info(data) {
    let api = methodUrl + apiUrl_orders + 'get_return_request_info?order_id=' + data.order_id
    return await get(api)
    // let api = methodUrl + apiUrl_orders + 'get_return_request_info'
    // return await postMethod(api, data)
}

export async function cancelReasonlist() {
    let api = methodUrl + apiUrl_masters + 'get_cancel_reasons'
    return await get(api)
}

export async function returnReasonlist() {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.mobileapi.get_return_request_details'
    return await get(api)
}

export async function get_search_products(data) {
    let api = methodUrl + apiUrl_product + 'get_search_products'
    return await postMethod(api, data)
}

export async function get_brand_based_products(data) {
    let api = methodUrl + apiUrl_product + 'get_brand_based_products'
    return await postMethod(api, data)
}

export async function insert_email_subscription(data) {
    let api = methodUrl + 'ecommerce_business_store.ecommerce_business_store.api.insert_email_subscription';
    return await postMethod(api, data)
}

export async function enquiry_data(data){
    let api=methodUrl+'ecommerce_business_store.ecommerce_business_store.v2.customer.insert_contact_enquiry'
    return await postMethod(api,data)
}

export async function login_seller(data){
    let api=methodUrl+'ecommerce_business_store.ecommerce_business_store.mobileapi.login_customer'
    return await postMethod(api,data)
}

export async function  pincode_availability(zipcode){
    let data = {zipcode : zipcode}
    let api= methodUrl+'ecommerce_business_store.ecommerce_business_store.api.check_pincode_availability'
    return await postMethod(api,data)
  }