import Footer from "@/components/footer/Footer";
import WebHeader from "@/components/header/WebHeader";
import RootLayout from "@/layout/RootLayout";
// import "@/styles/globals.css";
import { Provider } from 'react-redux'
import store from '@/redux/store'
import { useRouter } from "next/router";
import '@/styles/globals.scss'
import 'rodal/lib/rodal.css'
import { useEffect, useState } from "react";
import { websiteSettings } from "@/libs/api";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  const route = useRouter()
  let [website_settings, setWebsite_settings] = useState()

  useEffect(() => {
    get_websiteSettings()
  }, [])

  async function get_websiteSettings() {
    let res = await websiteSettings();
    if (res && res.message) {
      website_settings = res.message;
      setWebsite_settings(website_settings)
    }
  }
  return (
    <Provider store={store}>
      <ToastContainer position={'bottom-right'} autoClose={2000} />
      <RootLayout website_settings={website_settings}>
        <WebHeader website_settings={website_settings && website_settings} />
        <Component {...pageProps} />
        <Footer />
      </RootLayout>
    </Provider>
  );
}
