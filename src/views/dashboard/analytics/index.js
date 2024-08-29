// ** React Imports
import { useContext, useState } from 'react'

// ** Icons Imports
import { Award, ChevronDown, List } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
// import Timeline from '../../../'
import AvatarGroup from '@components/avatar-group'
import DataTable from 'react-data-table-component'
// ** Utils
// import { kFormatter } from '@utils'
import ReactPaginate from 'react-paginate'


// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'
import './table.css'
// ** Reactstrap Imports
// import { Row, Col, Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

// ** Demo Components
// import InvoiceList from '@src/views/apps/invoice/list'
// import Sales from '@src/views/ui-elements/cards/analytics/Sales'
// import AvgSessions from '@src/views/ui-elements/cards/analytics/AvgSessions'
// import CardAppDesign from '@src/views/ui-elements/cards/advance/CardAppDesign'
// import OrdersReceived from '@src/views/ui-elements/cards/statistics/OrdersReceived'
// import SubscribersGained from '@src/views/ui-elements/cards/statistics/SubscribersGained'
// import CardCongratulations from '@src/views/ui-elements/cards/advance/CardCongratulations'

// ** Images
// import jsonImg from '../../../assets/images/icons/json.png'

// // ** Avatar Imports
// import avatar6 from '@src/assets/images/portrait/small/avatar-s-6.jpg'
// import avatar7 from '@src/assets/images/portrait/small/avatar-s-7.jpg'
// import avatar8 from '@src/assets/images/portrait/small/avatar-s-8.jpg'
// import avatar9 from '@src/assets/images/portrait/small/avatar-s-9.jpg'
// import avatar20 from '@src/assets/images/portrait/small/avatar-s-20.jpg'

// ** Styles
// import '@styles/react/libs/charts/apex-charts.scss'
import SupportTracker from '../../ui-elements/cards/analytics/SupportTracker'

import SubscribersGained from '../../ui-elements/cards/statistics/SubscribersGained'
import OrdersReceived from '../../ui-elements/cards/statistics/OrdersReceived'
import AvgSessions from '../../ui-elements/cards/analytics/AvgSessions'
import ProfitLineChart from '../../ui-elements/cards/statistics/ProfitLineChart'
import { Card, Button, Input, Col, Row } from 'reactstrap'
import CardCongratulations from '../../ui-elements/cards/advance/CardCongratulations'
import OrdersBarChart from "../../ui-elements/cards/statistics/OrdersBarChart"
import MyTable from '../../Table'
import CompanyTable from './CompanyTable'
const AnalyticsDashboard = () => {
  const [value, setValue] = useState('')
  const [sort, setSort] = useState('desc')
  const [sortColumn, setSortColumn] = useState('id')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusValue, setStatusValue] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  // ** Context
  const { colors } = useContext(ThemeColors)
  const data = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
    { id: 3, name: 'Jane', age: 25 },
    { id: 4, name: 'Jane', age: 25 },
    { id: 5, name: 'Jane', age: 25 },
    { id: 6, name: 'Jane', age: 25 },
    { id: 7, name: 'Jane', age: 25 },
    { id: 8, name: 'Jane', age: 25 },
    { id: 9, name: 'Jane', age: 25 },
    { id: 10, name: 'Jane', age: 25 },
    { id: 11, name: 'Jane', age: 25 },
    { id: 12, name: 'Jane', age: 25 },
    { id: 13, name: 'Jane', age: 25 },
    { id: 14, name: 'Jane', age: 25 },

    // Add more data as needed
  ]
  const handlePagination = page => {
    dispatch(
      getData({
        sort,
        q: value,
        sortColumn,
        status: statusValue,
        perPage: rowsPerPage,
        page: page.selected + 1
      })
    )
    setCurrentPage(page.selected + 1)
  }

  const CustomPagination = () => {
    const count = Number((data.length / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        nextLabel=''
        breakLabel='...'
        previousLabel=''
        pageCount={count || 1}
        activeClassName='active'
        breakClassName='page-item'
        pageClassName={'page-item'}
        breakLinkClassName='page-link'
        nextLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousLinkClassName={'page-link'}
        previousClassName={'page-item prev'}
        onPageChange={page => handlePagination(page)}
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        containerClassName={'pagination react-paginate justify-content-end p-1'}
      />
    )
  }

  const columns = [
    { name: 'ID', selector: 'id', sortable: true },
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Age', selector: 'age', sortable: true },
  ];
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='6' xs='12'>
          <CardCongratulations />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained
          // kFormatter={kFormatter} 
          />
        </Col>
        <Col lg='3' sm='6'>
          <OrdersReceived
            //  kFormatter={kFormatter}
            warning={colors.warning.main} />
        </Col>
      </Row>

      <Row className='match-height'>
        <Col lg='6' xs='12'>
          <AvgSessions primary={colors.primary.main} />
        </Col>
        <Col lg='6' xs='12'>
          <SupportTracker primary={colors.primary.main} danger={colors.danger.main} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='3' md='3' xs='12'>
        <OrdersBarChart warning={colors.warning.main} />
        </Col>
        <Col lg='3' md='3' xs='12'>
        <ProfitLineChart info={colors.info.main} />

        </Col>
        <Col lg='3' md='3' xs='12'></Col>

        <Col lg='12' md='12' xs='12'>
        <CompanyTable />
        </Col>


        </Row>
      <Row className='match-height'>
        <Col lg='12' xs='12'>
          <MyTable 
          data={data}
          currentPage={currentPage}
          columns={columns}
          />
         
        </Col>
      </Row>

    </div>
  )
}

export default AnalyticsDashboard
