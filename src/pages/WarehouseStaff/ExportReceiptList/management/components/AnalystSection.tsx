import React from 'react'

type Props = {}
import StatisticPart from './StatisticPart';
const AnalystSection = (props: Props) => {
    const data = [
        {
            "title": "Revenue",
            "content": "845,1258",
            "isMoneyCurrency": true

        },
        {
            "title": "Units Sold",
            "content": "159,1258",
            "isMoneyCurrency": false
        },
        {
            "title": "Revenue",
            "content": "84,9658",
            "isMoneyCurrency": false
        },
    ]
  return (
    <div className='flex justify-evenly gap-4'>
            {data.map((one, index) => (
                <StatisticPart
                    key={index} // Always add a unique key when mapping components
                    title={one.title}
                    content={one.content}
                    isMoneyCurrency={one.isMoneyCurrency}
                />
            ))}
        </div>
  )
}

export default AnalystSection