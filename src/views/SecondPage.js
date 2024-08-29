import { useState } from "react";
import { Card,
   CardHeader,
   Modal,
   CardBody,
   CardText,
   CardTitle,
   ListGroup,
   ModalBody,
   ModalHeader,
   DropdownMenu,
   DropdownItem,
   ListGroupItem,
   DropdownToggle,
   UncontrolledDropdown,
  Button,
  Label
 } from "reactstrap";
 import { selectThemeColors } from '@utils'
 import Select, { components } from 'react-select'
 import { FileText, Users, Link } from 'react-feather'
const SecondPage = () => {
  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          {/* <Avatar className='my-0 me-1' size='sm' img="{data.avatar}" /> */}
          <div>{data.label}</div>
        </div>
      </components.Option>
    )
  }
  const [show, setShow] = useState(false)
  const options = [
    { value: 'Donna Frank', label: 'Donna Frank',   },
    { value: 'Jane Foster', label: 'Jane Foster',   },
    { value: 'Gabrielle Robertson', label: 'Gabrielle Robertson',   },
    { value: 'Lori Spears', label: 'Lori Spears',   },
    { value: 'Sandy Vega', label: 'Sandy Vega',   },
    { value: 'Cheryl May', label: 'Cheryl May',   }
  ]
  
  const data = [
    {
      type: 'Can Edit',
      name: 'Lester Palmer',
      username: 'pe@vogeiz.net'
    },
    {
      type: 'Owner',
      name: 'Mittie Blair',
      username: 'peromak@zukedohik.gov'
    },
    {
      type: 'Can Comment',
      name: 'Marvin Wheeler',
      username: 'rumet@jujpejah.net'
    },
    {
      type: 'Can View',
      name: 'Nannie Ford',
      username: 'negza@nuv.io'
    },
    {
      type: 'Can Edit',
      name: 'Julian Murphy',
      username: 'lunebame@umdomgu.net'
    },
    {
      type: 'Can View',
      name: 'Sophie Gilbert',
      username: 'ha@sugit.gov'
    },
    {
      type: 'Can Comment',
      name: 'Chris Watkins',
      username: 'zokap@mak.org'
    },
    {
      type: 'Can Edit',
      name: 'Adelaide Nichols',
      username: 'ujinomu@jigo.com'
    }
  ]
  return (
    <>
{/* buton  */}
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardBody>
        <CardText>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </CardText>
        <Button color="primary" onClick={() => setShow(true)}>Go somewhere</Button>
      </CardBody>
      </Card>
      {/* Modal  */}
      <Modal isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-4'>
          <h1 className='text-center mb-1'>Share Project</h1>
          <p className='text-center'>Share project with a team members</p>
          <Label for='addMemberSelect' className='form-label fw-bolder font-size font-small-4 mb-50'>
            Add Members
          </Label>
          <Select
            options={options}
            isClearable={false}
            id='addMemberSelect'
            theme={selectThemeColors}
            className='react-select'
            classNamePrefix='select'
            components={{
              Option: OptionComponent
            }}
          />
          <p className='fw-bolder pt-50 mt-2'>12 Members</p>
          <ListGroup flush className='mb-2'>
            {data.map(item => {
              return (
                <ListGroupItem key={item.name} className='d-flex align-items-start border-0 px-0'>
                  {/* <Avatar className='me-75' img="{item.img}" imgHeight={38} imgWidth={38} /> */}
                  <div className='d-flex align-items-center justify-content-between w-100'>
                    <div className='me-1'>
                      <h5 className='mb-25'>{item.name}</h5>
                      <span>{item.username}</span>
                    </div>
                    <UncontrolledDropdown>
                      <DropdownToggle color='flat-secondary' caret>
                        <span className='d-lg-inline-block d-none'>{item.type}</span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem className='w-100'>Owner</DropdownItem>
                        <DropdownItem className='w-100'>Can Edit</DropdownItem>
                        <DropdownItem className='w-100'>Can Comment</DropdownItem>
                        <DropdownItem className='w-100'>Can View</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </ListGroupItem>
              )
            })}
          </ListGroup>
          <div className='d-flex align-content-center justify-content-between flex-wrap'>
            <div className='d-flex align-items-center me-2'>
              <Users className='font-medium-2 me-50' />
              <p className='fw-bolder mb-0'>Public to Vuexy - Pixinvent</p>
            </div>
            <a className='fw-bolder' href='#' onClick={e => e.preventDefault()}>
              <Link className='font-medium-2 me-50' />
              <span>Copy project link</span>
            </a>
          </div>
        </ModalBody>
      </Modal>
      {/* Modal end  */}
    <Card>
      <CardHeader>
        <CardTitle>Create Awesome 🙌</CardTitle>
      </CardHeader>
      <CardBody>
        <CardText>This is your second page.</CardText>
        <CardText>
          Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
          Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie
          wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
        </CardText>
      </CardBody>
    </Card>    </>
  );
};

export default SecondPage;
