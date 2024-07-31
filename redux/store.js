import { configureStore } from '@reduxjs/toolkit'
import websiteSettings from './slice/websiteSettings'
import cartSettings from './slice/cartSettings'
// import alertAction from './slice/alertAction'
import logInInfo from './slice/logInInfo'
import customerInfo from './slice/customerInfo'
import checkoutInfo from './slice/checkoutInfo'
// import ProductListFilters from './slice/ProductListFilters'

export default configureStore({
  reducer: {
    webSettings: websiteSettings,
    cartSettings: cartSettings,
    // alertAction:alertAction,
    logInInfo:logInInfo,
    customerInfo:customerInfo,
    checkoutInfo:checkoutInfo,
    // ProductListFilters:ProductListFilters
  },
})