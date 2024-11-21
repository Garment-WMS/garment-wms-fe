import React, { useEffect, useState } from 'react'
import ProductStatistic from './components/ProductStatistic'
import ProductList from './components/ProductList'
import { Product } from '@/types/ProductType'
import { filterType } from '@/types/Shared'
import privateCall from '@/api/PrivateCaller'
import { productApi } from '@/api/services/productApi'
import { TypeChart } from './components/TypeChart'

type Props = {}

const ProductManagement = (props: Props) => {
  const [productType, setProductType] = useState<Product[]>([]);
  const [productTypesToRender, setProductTypesToRender] = useState<filterType[]>([]); 
  const fetchProductTypes = async () => {
    try {
      const res = await privateCall(productApi.getAllProduct());
      const data = res.data.data.data;
      const productTypes = data.map((item: Product) => ({
        label: item.name,
        value: item.name
      }));
      setProductTypesToRender(productTypes);
      setProductType(data);
    } catch (error) {
      console.error('Failed to fetch product types:', error);
    }
  };
  useEffect(() => {
    fetchProductTypes();
  }, []);
  return (
    <div className='h-full w-full px-4 flex flex-col gap-4'>
        <TypeChart productTypeList={productType}/>
        <ProductList productTypes={productTypesToRender}/>
    </div>
  )
}

export default ProductManagement