import React from 'react'
import ProductStatistic from './components/ProductStatistic'
import ProductList from './components/ProductList'

type Props = {}

const ProductManagement = (props: Props) => {
  return (
    <div className='h-full w-full px-4 flex flex-col gap-4'>
        <ProductStatistic/>
        <ProductList/>
    </div>
  )
}

export default ProductManagement