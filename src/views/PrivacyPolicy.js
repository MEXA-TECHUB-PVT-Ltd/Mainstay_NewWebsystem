import { useState } from 'react';
import {
  Card,
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
  Label,
  Container,
  Row,
  Col,
} from 'reactstrap';
import { selectThemeColors } from '@utils';
import Select, { components } from 'react-select';
import { FileText, Users, Link } from 'react-feather';
const PrivacyPolicy = () => {
  const OptionComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className='d-flex flex-wrap align-items-center'>
          {/* <Avatar className='my-0 me-1' size='sm' img="{data.avatar}" /> */}
          <div>{data.label}</div>
        </div>
      </components.Option>
    );
  };
  const [show, setShow] = useState(false);
  const options = [
    { value: 'Donna Frank', label: 'Donna Frank' },
    { value: 'Jane Foster', label: 'Jane Foster' },
    { value: 'Gabrielle Robertson', label: 'Gabrielle Robertson' },
    { value: 'Lori Spears', label: 'Lori Spears' },
    { value: 'Sandy Vega', label: 'Sandy Vega' },
    { value: 'Cheryl May', label: 'Cheryl May' },
  ];

  const data = [
    {
      type: 'Can Edit',
      name: 'Lester Palmer',
      username: 'pe@vogeiz.net',
    },
    {
      type: 'Owner',
      name: 'Mittie Blair',
      username: 'peromak@zukedohik.gov',
    },
    {
      type: 'Can Comment',
      name: 'Marvin Wheeler',
      username: 'rumet@jujpejah.net',
    },
    {
      type: 'Can View',
      name: 'Nannie Ford',
      username: 'negza@nuv.io',
    },
    {
      type: 'Can Edit',
      name: 'Julian Murphy',
      username: 'lunebame@umdomgu.net',
    },
    {
      type: 'Can View',
      name: 'Sophie Gilbert',
      username: 'ha@sugit.gov',
    },
    {
      type: 'Can Comment',
      name: 'Chris Watkins',
      username: 'zokap@mak.org',
    },
    {
      type: 'Can Edit',
      name: 'Adelaide Nichols',
      username: 'ujinomu@jigo.com',
    },
  ];
  return (
    <>
      <Container>
        <Row>
          <Col sm={12}>
            <div className="">
              <h2 className="primary">Privacy Policy</h2>
              <p>
                Your privacy matters to us. Explore our transparent and
                user-friendly Privacy Policy to understand how we safeguard your
                personal information.
              </p>
            </div>
          </Col>
          <Col sm={12}>
            <div className="">
              <img
                style={{ width: "90%", height: "auto" }}
                src="/img/policy.png"
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              At Mainstays, accessible from https://Mainstays.com, one of our
              main priorities is the privacy of our visitors. This Privacy
              Policy document contains types of information that is collected
              and recorded by Mainstays and how we use it. If you have
              additional questions or require more information about our Privacy
              Policy, do not hesitate to contact us. This Privacy Policy applies
              only to our online activities and is valid for visitors to our
              website with regards to the information that they shared and/or
              collect in Mainstays. This policy is not applicable to any
              information collected offline or via channels other than this
              website.
            </div>
            <div>
              <h2>Information we collect</h2>
              <p>
                The personal information that you are asked to provide, and the
                reasons why you are asked to provide it, will be made clear to
                you at the point we ask you to provide your personal
                information. If you contact us directly, we may receive
                additional information about you such as your name, email
                address, phone number, the contents of the message and/or
                attachments you may send us, and any other information you may
                choose to provide. When you register for an Account, we may ask
                for your contact information, including items such as name,
                company name, address, email address, and telephone number.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
