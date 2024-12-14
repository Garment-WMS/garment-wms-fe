import React from 'react'
import StocktakingCalendar from './components/StocktakingCalendar'
import StocktakingReport from './components/StocktakingReport'
import StocktakingPlanList from './components/StocktakingPlanList'

type Props = {}


const StocktakingManagement = (props: Props) => {
  return (
    <div className='flex flex-col gap-4'>
        <StocktakingCalendar/>
        {/* <StocktakingPlanList/> */}
        <StocktakingReport/>
    </div>
  )
}

export default StocktakingManagement