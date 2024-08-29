// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, Input, Label, Row, Col } from 'reactstrap'

const DataTableServerSide = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [searchValue, setSearchValue] = useState('')
  const [data, setData] = useState([])
 
    useEffect(() => {
    const filteredData = allData.filter(item => 
      item.full_name.toLowerCase().includes(searchValue.toLowerCase())
    )
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    setData(paginatedData)
  }, [currentPage, rowsPerPage, searchValue])

  const handleFilter = e => {
    setSearchValue(e.target.value)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }
 
  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(allData.length / rowsPerPage)

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel='...'
        pageCount={Math.ceil(count) || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        }
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    return data
  }
  // rows 
  const allData = [
    {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      post: 'Software Engineer',
      city: 'San Francisco',
      start_date: '2020-01-01',
      salary: '$120,000'
    },
    {
      full_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      post: 'Product Manager',
      city: 'New York',
      start_date: '2019-04-15',
      salary: '$130,000'
    },
    {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },  {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },  {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },  {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },  {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },  {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },  {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    }, 
     {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },
      {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },  {
      full_name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      post: 'Data Scientist',
      city: 'Seattle',
      start_date: '2018-07-30',
      salary: '$140,000'
    },

  ]
  // columns 
  const serverSideColumns = [
    {
      sortable: true,
      name: 'Full Name',
      minWidth: '225px',
      selector: row => row.full_name
    },
    {
      sortable: true,
      name: 'Email',
      minWidth: '250px',
      selector: row => row.email
    },
    {
      sortable: true,
      name: 'Position',
      minWidth: '250px',
      selector: row => row.post
    },
    {
      sortable: true,
      name: 'Office',
      minWidth: '150px',
      selector: row => row.city
    },
    {
      sortable: true,
      name: 'Start Date',
      minWidth: '150px',
      selector: row => row.start_date
    },
    {
      sortable: true,
      name: 'Salary',
      minWidth: '150px',
      selector: row => row.salary
    }
  ]

  return (
    <Fragment>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'>Server Side</CardTitle>
        </CardHeader>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='6'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>show</Label>
              <Input
                className='dataTable-select'
                type='select'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </Input>
              <Label for='sort-select'>entries</Label>
            </div>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='6'>
            <Label className='me-1' for='search-input'>
              Search
            </Label>
            <Input
              className='dataTable-filter'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchValue}
              onChange={handleFilter}
            />
          </Col>
        </Row>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            paginationServer
            className='react-dataTable'
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={dataToRender()}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default memo(DataTableServerSide)
