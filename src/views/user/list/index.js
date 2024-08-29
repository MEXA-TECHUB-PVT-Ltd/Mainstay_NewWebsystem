// ** User List Component
import Table from './Table'

// ** Reactstrap Imports
import { Row, Col, Button } from 'reactstrap'

// ** Custom Components
import StatsHorizontal from '../../../@core/components/widgets/stats/StatsHorizontal'

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from 'react-feather'

// ** Styles
import '@styles/react/apps/app-users.scss'
import CompanyTable from '../../dashboard/analytics/CompanyTable'
import SidebarNewUsers from './Sidebar'
import { useState } from 'react'

const UsersList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  return (
    <div className='app-user-list'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Users'
            icon={<User size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>21,459</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Paid Users'
            icon={<UserPlus size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>4,567</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Active Users'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>19,860</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Pending Users'
            icon={<UserX size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>237</h3>}
          />
        </Col>
        <Col lg='6' sm='6'>
        <h1 className='mb-1'>User List</h1>

          </Col>
          <Col lg='6' sm='6' className='
          d-flex
          align-items-center
          justify-content-end
          flex-wrap
          mt-sm-0
          mt-1
          '>
          <Button color="primary" onClick={toggleSidebar}>Add User</Button>
          </Col>
        <Col lg='12' sm='12'>
                <CompanyTable />
      {/* <Table /> */}
          </Col>
          <SidebarNewUsers open={sidebarOpen} toggleSidebar={toggleSidebar} />
      </Row>

    </div>
  )
}

export default UsersList
