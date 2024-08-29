import React from "react";
import ReactDatePicker from "react-datepicker";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import "./style.css";
import { useTranslation } from "react-i18next";

const BookNow = ({
  isOpen,
  setIsBookModal,
  toggle,
  availability,
  selectCategory,
  setSelectCategory,
  selectedDate,
  setSelectedDate,
  isDateDisabled,
  getStartTimes,
  time,
  setTime,
  setDurationModal,
  convertTo12Hour,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { t } = useTranslation();
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleCategorySelect = (category) => {
    setSelectCategory(category);
    toggleDropdown();
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
      <ModalHeader toggle={toggle}>Request Session</ModalHeader>
      <ModalBody>
        <h2
          className="text-primary"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          {t("Select Category")}
        </h2>

        <Row>
          <Col sm="12" md="12" lg="12">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret className="bg-color">
                {availability?.coaching_area_list.find(
                  (item) => item.coaching_area_id === selectCategory
                )?.name || t("Select Category")}
              </DropdownToggle>
              <DropdownMenu>
                {availability?.coaching_area_list.map((item, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => handleCategorySelect(item.coaching_area_id)}
                  >
                    <img
                      src={item.icon}
                      alt="Icon"
                      className="me-2"
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "0px !impotent",
                      }}
                    />
                    {item.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>

        <div style={{ marginTop: "20px" }}>
          <h2
            className="text-primary"
            style={{ fontSize: "20px", fontWeight: "600" }}
          >
            {t("Booking Availability")}
          </h2>
          <div style={{ width: "100%", textAlignLast: "center" }}>
            <ReactDatePicker
              selected={selectedDate}
              onChange={(date) => {
                // if (!sessionData) {
                setSelectedDate(date);
                // }
              }}
              inline
              filterDate={isDateDisabled}
              className="form-control form-control-solid w-250px"
            />
          </div>
        </div>
        <div>
          <h2
            className="text-primary"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              paddingTop: "10px",
            }}
          >
            {t("Select Time")}
          </h2>
          <div>
            {getStartTimes().map((row, index) => (
              <Badge
                key={index}
                color={time === row ? "primary" : "light"}
                onClick={() => setTime(row)}
                className={time === row ? "text-light mt-1" : "text-dark mt-1"}
                style={{
                  fontSize: "14px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                {convertTo12Hour(row) || 0}
              </Badge>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", margin: "20px" }}>
          <Button
            disabled={!time || !selectCategory}
            style={{ borderRadius: "35px" }}
            color="primary"
            onClick={() => {
              setIsBookModal(false);
              setDurationModal(true);
            }}
          >
            {t("Request Session")}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default BookNow;
