import React from 'react'
import StocktakingCalendar from './components/StocktakingCalendar'
import StocktakingReport from './components/StocktakingReport'

type Props = {}

const StocktakingManagement = (props: Props) => {
  return (
    <div className='flex flex-col gap-4'>
        <StocktakingCalendar/>
        <StocktakingReport/>
    </div>
  )
}

export default StocktakingManagement