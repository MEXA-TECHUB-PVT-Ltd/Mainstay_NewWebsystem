// ** React Imports
import { useEffect, useState } from 'react'

// ** Third Party Components
import axios from 'axios'
import { Users } from 'react-feather'

// ** Custom Components
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'

const SubscribersGained = () => {
  // ** State
  const [data, setData] = useState([{
    name: 'Subscribers',
    data: [31, 40, 28, 51, 42, 109, 100]
  },
  ])

 

  return (
    <StatsWithAreaChart
      icon={<Users size={21} />}
      color='primary'
      stats='43'
      statTitle='Subscribers Gained'
      series={data}
      type='area'
    />
  )
}

export default SubscribersGained
