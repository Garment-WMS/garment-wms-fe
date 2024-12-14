import React from 'react'
import DisposeIntroduction from './components/DisposeIntroduction'
import MaterialDisposeList from './components/MaterialDisposeList'
import ProductDisposeList from './components/ProductDisposeList'

type Props = {}

const DisposeManagement = (props: Props) => {
  return (
    <div>
        <DisposeIntroduction/>
        <MaterialDisposeList/>
        <ProductDisposeList/>
    </div>
  )
}

export default DisposeManagement