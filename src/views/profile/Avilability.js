// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

// ** Icons Imports
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  Delete,
  Trash,
  ChevronLeft,
  Plus,
  X,
  XCircle,
} from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  // Form,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupText,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

import moment from "moment";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState, useEffect } from "react";
import { authDelete, authGet, authPost, get, post, put } from "../../urls/api";
import IOSToggleButton from "../../utility/IOSToggleButton";
import CustomTimePicker from "../../utility/CustomTimePicker";
import CustomTimeInput from "../../utility/CustomTimePicker";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Availability = () => {
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const [availability, setAvailability] = useState({
    Monday: {
      enabled: false,
      timeSessions: [],
    },
    Tuesday: { enabled: false, timeSessions: [] },
    Wednesday: { enabled: false, timeSessions: [] },
    Thursday: { enabled: false, timeSessions: [] },
    Friday: { enabled: false, timeSessions: [] },
    Saturday: { enabled: false, timeSessions: [] },
    Sunday: { enabled: false, timeSessions: [] },
  });

  const [selectedDay, setSelectedDay] = useState();
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [timeError, setTimeError] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState("00:00 AM");
  const [endTime, setEndTime] = useState("00:00 AM");
  const [change, setChange] = useState(false);
  const toggleModal = (day, index = null) => {
    // console.log("Toggle modal", availability[day]?.enabled);
    if (!availability[day]?.enabled) {
      toast.error(t("Please choose a day to add the time slot."));
      return;
    }
    setModalOpen(!modalOpen);
    setSelectedDay(day);
    setSelectedTimeIndex(index); // Set the selected time index
    if (index !== null) {
      // If index is not null, set the startTime and endTime based on the selected time session
      setStartTime(availability[day].timeSessions[index].start);
      setEndTime(availability[day].timeSessions[index].end);
    } else {
      // If index is null, reset startTime and endTime
      setStartTime("");
      setEndTime("");
    }
  };

  const toggleDay = (day) => {
    console.log("day", day);
    setAvailability((prevAvailability) => {
      const updatedAvailability = { ...prevAvailability };
      updatedAvailability[day].enabled = !updatedAvailability[day].enabled;
      return updatedAvailability;
    });
  };

  const handleTimeChange = (event, selectedTime) => {
    console.log(selectedTime);
    if (selectedDay && selectedTime !== undefined) {
      if (!startTime) {
        setStartTime(selectedTime);
      } else {
        setEndTime(selectedTime);
        setAvailability((prevAvailability) => {
          const updatedAvailability = { ...prevAvailability };
          updatedAvailability[selectedDay].timeSessions.push({
            start: startTime,
            end: selectedTime,
          });
          return updatedAvailability;
        });
        //hidePicker();
      }
    }
  };

  const removeTimeSession = (day, index) => {
    setAvailability((prevAvailability) => {
      const updatedAvailability = { ...prevAvailability };
      updatedAvailability[day].timeSessions.splice(index, 1);
      return updatedAvailability;
    });
  };

  const addAvailability = () => {
    console.log(startTime);
    if (!startTime) {
      // console.log("Required");
      setTimeError({ start: "Start Time is required" });
    }
    if (!endTime) {
      setTimeError({ end: "Start Time is required" });
    }
    let startTime24 = moment(startTime, "hh:mm A").format("HH:mm");
    let endTime24 = moment(endTime, "hh:mm A").format("HH:mm");
    if (selectedDay && startTime && endTime) {
      const secondStartTime = convertToSeconds(startTime);
      const secondEndTime = convertToSeconds(endTime);

      setAvailability((prevAvailability) => {
        const updatedAvailability = { ...prevAvailability };

        if (selectedTimeIndex !== null) {
          // Update existing time session
          updatedAvailability[selectedDay].timeSessions[selectedTimeIndex] = {
            start: secondStartTime,
            end: secondEndTime,
          };
        } else {
          // Add new time session at the beginning of the array
          updatedAvailability[selectedDay].timeSessions.unshift({
            start: secondStartTime,
            end: secondEndTime,
          });
        }

        return updatedAvailability;
      });

      // Reset startTime, endTime, and selectedTimeIndex
      setTimeError({ start: "", end: "" });
      setStartTime("");
      setEndTime("");
      setSelectedTimeIndex(null);
      setModalOpen(false);
    }
  };

  const convertToSeconds = (time) => {
    const [hours, minutes] = time.split(":");
    const seconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;

    // Formatting to "HH:mm:ss"
    const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8);

    return formattedTime;
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = async (e) => {
    setEndTime(e.target.value);
  };

  // const handleSubmit = async () => {
  //   const secondStartTime = convertToSeconds(startTime);
  //   const secondEndTime = convertToSeconds(endTime);
  //   const apiData = await authPost('section/create', {
  //     start_time: secondStartTime,
  //     end_time: secondEndTime,
  //     day_id: selectedDay,
  //   });

  //   if (!apiData.success) {
  //     setError(apiData.message);
  //   } else {
  //     setChange(!change);
  //     toggleModal();

  //     //  open page dashboard/analytics
  //   }
  // };

  const handleNext = async () => {
    // console.log(availability);
    let arr = [];
    arr.push(availability);
    try {
      setLoading(true);
      const result = await authPost("section/create", {
        sectionDetails: availability,
      });
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }

      if (result.success) {
        navigate("/duration");
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  return (
    <div className="auth-wrapper auth-cover px-2">
      <img
        className="img-fluid"
        src={"/img/effect.png"}
        alt="Login Cover"
        disabled
        style={{
          zIndex: "-100",
          height: "50%",
          position: "absolute",
          bottom: "50%",
        }}
      />
      <Link to="/" className="position-absolute top-0 start-0 m-3">
        <ChevronLeft onClick={() => navigate(-1)} />
      </Link>
      <Col className="auth-inner m-0 justify-content-center">
        <Row
          className="d-flex justify-content-center"
          style={{ marginTop: "3%" }}
        >
          <CardTitle
            tag="h2"
            className="fw-bold m-3 text-center"
            style={{ color: "#161616", fontSize: "25px", fontWeight: "700" }}
          >
            {t("Set Your Availability")}
          </CardTitle>{" "}
          <Col
            className="d-flex align-items-center d-flex justify-content-center auth-bg   "
            lg="3"
            sm="12"
            style={{
              paddingTop: "20px",
              paddingBottom: "15px",

              height: "85%",
              borderRadius: "34px",
              border: "2px solid #f8f8f8",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Col className="px-xl-2 mx-auto " sm="8" md="6" lg="12">
              <>
                <Link
                  className="brand-logo"
                  to="/"
                  onClick={(e) => e.preventDefault()}
                ></Link>
                <div className="mb-1 ">
                  <p className="text-left">
                    {t("Set the hours you are free to accept sessions")}
                  </p>

                  {availability &&
                    Object.keys(availability).map((day) => {
                      const item = availability[day];
                      console.log("ITEMS: ", item);
                      return (
                        <div
                          key={day}
                          className="d-flex justify-content-between mt-2"
                        >
                          <div className="d-flex " style={{ height: "30px" }}>
                            <IOSToggleButton
                              defaultChecked={item.enabled}
                              handleChange={() => toggleDay(day)}
                            />
                            <Label
                              className="form-check-label "
                              for="remember-me"
                              style={{
                                alignSelf: "center",
                                marginLeft: "10px",
                                color: item.enabled ? "#1E1E1E" : "#A1A1A1",
                              }}
                            >
                              {day}
                            </Label>
                          </div>
                          <div>
                            <p style={{ textAlign: "end" }}>
                              {
                                <Plus
                                  size={20}
                                  color="#0F6D6A"
                                  onClick={() => toggleModal(day)}
                                  style={{
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                  }}
                                />
                              }
                            </p>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {item?.timeSessions?.map((row, index) => {
                                console.log("TIME: " + row?.start, row?.end);
                                return (
                                  <div className="d-flex">
                                    <Badge
                                      key={index}
                                      className="mb-1"
                                      pill
                                      color="light"
                                      style={{
                                        color: item.enabled
                                          ? "#1E1E1E"
                                          : "#A1A1A1",
                                        fontSize: "13px",
                                        fontWeight: "400",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => toggleModal(day, index)} // Open modal for editing
                                    >
                                      {moment(row?.start, "HH:mm:ss").format(
                                        "h:mm A"
                                      ) +
                                        "-" +
                                        moment(row?.end, "HH:mm:ss").format(
                                          "h:mm A"
                                        )}
                                    </Badge>

                                    <XCircle
                                      size={18}
                                      color="red"
                                      onClick={() =>
                                        removeTimeSession(day, index)
                                      }
                                      style={{
                                        cursor: "pointer",
                                        // marginRight:'10px'
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="error" style={{ color: "red" }}>
                  {error}
                </div>
                <Button
                  disabled={loading}
                  style={{ borderRadius: "35px" }}
                  color="primary"
                  block
                  onClick={handleNext}
                >
                  {loading ? <Spinner size="sm"></Spinner> : t("NEXT")}
                </Button>
              </>
            </Col>
          </Col>
        </Row>
        <img
          className="img-fluid"
          src={"/img/effect2.png"}
          alt="Login Cover"
          disabled
          style={{
            zIndex: "-100",
            height: "50%",
            position: "absolute",
            top: "50%",
            left: "80% ",
          }}
        />
      </Col>
      {/* <ToastContainer /> */}

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          <h3> {t("Select Time")} </h3>
        </ModalHeader>
        <ModalBody>
          <CustomTimeInput
            label={t("Start Time:")}
            value={startTime}
            onChange={setStartTime}
            timeError={timeError}
          />
          <CustomTimeInput
            label={t("End Time:")}
            value={endTime}
            onChange={setEndTime}
            timeError={timeError}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="justify-content-center"
            onClick={addAvailability}
          >
            {t("Save Time")}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Availability;
