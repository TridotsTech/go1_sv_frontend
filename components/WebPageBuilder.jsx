import React from 'react'
import ProductBox from './Product/ProductBox'

const WebPageBuilder = ({item}) => {
  return (
    <div>
         <ProductBox item={item}/>
    </div>
  )
}

export default WebPageBuilder