// ** React Imports
import { useNavigate } from "react-router-dom";

// ** Icons Imports
import { Plus, XCircle } from "react-feather";

// ** Reactstrap Imports
import { Label, Button, Badge, Modal, Spinner, ModalHeader } from "reactstrap";

import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { authPost, put } from "../../../../urls/api";
import IOSToggleButton from "../../../../utility/IOSToggleButton";
import TimePickerModal from "./TimePickerModal";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";

const AvailabilityModal = ({
  isModalOpen,
  toggleModal: toggleAvailabilityModal,
  availabilities,
  refetch,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  console.log(availabilities);

  let initialAvailability = {
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
  };

  const isAvailabilities = availabilities
    ? availabilities
    : initialAvailability;

  const [availability, setAvailability] = useState(isAvailabilities);

  useEffect(() => {
    if (availabilities) {
      setAvailability(availabilities);
    }
  }, [availabilities]);

  const [selectedDay, setSelectedDay] = useState();
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [timeError, setTimeError] = useState({ start: "", end: "" });

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const toggleModal = (day, index = null) => {
    if (!availability[day]?.enabled) {
      toast.error(t("Please choose a day to add the time slot."));
      return;
    }
    setModalOpen(!modalOpen);
    setSelectedDay(day);
    setSelectedTimeIndex(index);
    if (index !== null) {
      setStartTime(availability[day].timeSessions[index].start);
      setEndTime(availability[day].timeSessions[index].end);
    } else {
      setStartTime("");
      setEndTime("");
    }
  };

  const toggleDay = (day) => {
    setAvailability((prevAvailability) => {
      // Create a new object for the day with toggled 'enabled'
      const newDaySettings = {
        ...prevAvailability[day],
        enabled: !prevAvailability[day].enabled,
      };

      // Return new object with updated day settings
      return {
        ...prevAvailability,
        [day]: newDaySettings,
      };
    });
  };

  const removeTimeSession = (day, index) => {
    setAvailability((prevAvailability) => {
      // Creating a copy of the existing timeSessions array
      const newTimeSessions = [...prevAvailability[day].timeSessions];

      // Removing an item using splice on the copied array
      newTimeSessions.splice(index, 1);

      // Creating a new availability object with the updated time sessions
      const updatedAvailability = {
        ...prevAvailability,
        [day]: {
          ...prevAvailability[day],
          timeSessions: newTimeSessions,
        },
      };

      return updatedAvailability;
    });
  };

  const addAvailability = () => {
    if (!startTime) {
      setTimeError({ start: "Start Time is required" });
    }
    if (!endTime) {
      setTimeError({ end: "End Time is required" });
    }

    const startTime24 = moment(startTime, "hh:mm A").format("HH:mm");
    const endTime24 = moment(endTime, "hh:mm A").format("HH:mm");

    if (selectedDay && startTime24 && endTime24) {
      setAvailability((prevAvailability) => {
        const updatedAvailability = {
          ...prevAvailability,
          [selectedDay]: {
            ...prevAvailability[selectedDay],
            timeSessions:
              selectedTimeIndex !== null
                ? prevAvailability[selectedDay].timeSessions.map(
                    (session, index) =>
                      index === selectedTimeIndex
                        ? { start: startTime24, end: endTime24 }
                        : session
                  )
                : [
                    { start: startTime24, end: endTime24 },
                    ...prevAvailability[selectedDay].timeSessions,
                  ],
          },
        };

        return updatedAvailability;
      });

      setStartTime("");
      setEndTime("");
      setTimeError({ start: "", end: "" });
      setSelectedTimeIndex(null);
      setModalOpen(false);
    }
  };

  const convertToSeconds = (time) => {
    const [hours, minutes] = time.split(":");
    const seconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
    const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8);
    return formattedTime;
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = async (e) => {
    setEndTime(e.target.value);
  };

  const handleUpdate = async () => {
    let arr = [];
    arr.push(availability);
    try {
      setLoading(true);
      const result = await put("section/update", {
        sectionDetails: availability,
      });
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }

      if (result.success) {
        refetch();
        toggleAvailabilityModal();
        toast.success(t("Availability updated"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleAvailabilityModal}>
          <h4 style={{ fontWeight: "bold", color: "#0F6D6A" }}>
            {t("Update Availabilities")}
          </h4>
        </ModalHeader>
        <div className="px-4 py-1">
          <div className="mb-1 ">
            <p className="text-left">
              {t("Set the hours you are free to accept sessions")}
            </p>

            {Object.keys(availability).map((day) => {
              const item = availability[day];
              return (
                <div key={day} className="d-flex justify-content-between mt-2">
                  <div className="d-flex " style={{ height: "30px" }}>
                    <IOSToggleButton
                      defaultChecked={item.enabled}
                      handleChange={() => toggleDay(day)}
                    />
                    <Label
                      className="form-check-label"
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
                      {item?.timeSessions?.map((row, index) => (
                        <div className="d-flex">
                          <Badge
                            key={index}
                            className="mb-1"
                            pill
                            color="light"
                            style={{
                              color: item.enabled ? "#1E1E1E" : "#A1A1A1",
                              fontSize: "13px",
                              fontWeight: "400",
                              cursor: "pointer",
                            }}
                            onClick={() => toggleModal(day, index)}
                          >
                            {moment(row?.start, "HH:mm:ss").format("h:mm A") +
                              "-" +
                              moment(row?.end, "HH:mm:ss").format("h:mm A")}
                          </Badge>

                          <XCircle
                            size={18}
                            color="red"
                            onClick={() => removeTimeSession(day, index)}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      ))}
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
            onClick={handleUpdate}
          >
            {loading ? <Spinner size="sm"></Spinner> : t("Update")}
          </Button>
        </div>
      </Modal>
      <TimePickerModal
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        startTime={startTime}
        handleStartTimeChange={handleStartTimeChange}
        endTime={endTime}
        handleEndTimeChange={handleEndTimeChange}
        addAvailability={addAvailability}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        timeError={timeError}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default AvailabilityModal;
