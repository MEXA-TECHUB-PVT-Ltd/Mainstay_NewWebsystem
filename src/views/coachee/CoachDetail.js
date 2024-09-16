import React, { useEffect, useRef, useState } from "react";
import Avatar from "@components/avatar";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { ChevronLeft, Link, MessageCircle, Star, User } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Badge,
  Spinner,
  Alert,
} from "reactstrap";
import { SOCKET_URL, authGet, authPost, get, post, put } from "../../urls/api";
import { toast } from "react-toastify";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Loader from "../../utility/Loader";
import CardPayment from "../../utility/CardPayment";
import {
  useGetCoachByIdQuery,
  useGetDurationQuery,
  useGetSectionByCoachQuery,
  useGetSessionQuery,
} from "../../redux/dashboardApi";
import moment from "moment";
import AgoraRTC from "agora-rtc-sdk-ng";
import { APP_ID } from "../../utility/Utils";
import { VideoRoom } from "../callingSmaple/videoRoom";
import RateModal from "./RateModal";
import ReviewsComponent from "./ReviewsComponent";
import filledStar from "../../@core/assets/images/logo/fill_star.png";
import PaymentModal from "./component/modals/PaymentModal";
import BookNow from "./component/modals/book/BookNow";
import { getBadgeImage } from "../../utility/badges";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import SessionEndModal from "../../@core/layouts/components/menu/vertical-menu/SessionEndModal";
import { useTranslation } from "react-i18next";

let socket;

const CoachDetail = () => {
  const { t } = useTranslation();
  const { lng } = useSelector((s) => s.languageSlice);
  // const [?, setData?] = + " " + data?.user?.last_name useState();
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const session = urlParams.get("session");
  const [joined, setJoined] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isRateModal, setIsRateModal] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [createSessionError, setCreateSessionError] = useState("");
  const sessionCompleted = sessionStorage.getItem("sessionCompleted");
  const [isOpenSessionEndModal, setIsOpenSessionEndModal] = useState(
    sessionCompleted === "true" ? true : false
  );

  const toggleSessionEndModal = () => {
    sessionStorage.removeItem("sessionCompleted");
    setIsOpenSessionEndModal(!isOpenSessionEndModal);
  };

  const handleRateModal = () => {
    sessionStorage.removeItem("sessionCompleted");
    setIsOpenSessionEndModal(false);
    setIsRateModal(!isRateModal);
  };

  // let sessionData;
  // let sessionRefetch;
  // if (session) {
  const {
    data: sessionData,
    isLoading: isLoadingSessionData,
    isError: isErrorCoachingArea,
    refetch: sessionRefetch,
    isFetching,
  } = useGetSessionQuery({ session });
  // sessionRefetch = refetch;
  // sessionData = data;
  // }useEffect(() => {
  // useEffect(() => {
  //   if (sessionData && !isFetching) {
  //     sessionRefetch();
  //   }
  // }, [sessionData, sessionRefetch, isFetching]);

  const coachName =
    sessionData && sessionData?.session?.session_data?.coach?.name;

  const { id } = useParams();
  const [durationModal, setDurationModal] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState();
  const [time, setTime] = useState();
  const [amount, setAmount] = useState();
  const [error, setError] = useState();
  const [selectCategory, setSelectCategory] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const [paymentModal, setPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [showVideoRoom, setShowVideoRoom] = useState(false);
  const [isRatingExists, setIsRatingExists] = useState(false);
  const [ratingData, setRatingData] = useState();
  const [reviewsData, setReviewsData] = useState([]);
  const [avgRating, setAvgRating] = useState();
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [isBookModal, setIsBookModal] = useState(false);
  const [socketData, setSocketData] = useState({
    sessionId: "",
    coachStarted: false,
  });
  const [sessionDataNew, setSessionDataNew] = useState(null);

  const sessionId = useSelector((state) => state.navbar.sessionId);
  const coachStarted = useSelector((state) => state.navbar.coachStarted);
  console.log(sessionId, coachStarted);

  const coacheeLocal =
    JSON.parse(localStorage.getItem("loginUserData")) || undefined;

  // const coacheeName =
  // coacheeLocal?.user?.first_name + " " + coacheeLocal?.user?.last_name;

  const toggleBook = () => {
    setIsBookModal(!isBookModal);
  };

  const togglePaymentModal = () => {
    console.log("click to toggle payment modal");
    setIsPaymentModal(!isPaymentModal);
  };

  // testing ................

  const sessionID = sessionData?.session?.session_data?.session_id;
  // *** check if already given the review
  const checkReviewExists = async () => {
    setRatingLoading(true);
    try {
      const response = await authGet(
        `rating/checkRatingExists?sessions_id=${session}`
      );
      const exist = response?.ratingExists;
      const rating = response?.rating;
      setRatingData(rating);
      setIsRatingExists(exist);
      setRatingLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setRatingLoading(false);
    }
  };
  useEffect(() => {
    if (session) {
      checkReviewExists();
    }
  }, [session]);

  const fetchAvgRating = async () => {
    try {
      const response = await authGet(
        `rating/getAverageRatingForCoach?coach_id=${id}`
      );
      if (response.success) {
        setAvgRating(response?.averageRating);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchAvgRating();
    }
  }, [id]);

  const fetchCoachReviews = async () => {
    try {
      const response = await authGet(`rating/getAllByCoach/${id}`);
      if (response.success) {
        const result = response.result;
        setReviewsData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchCoachReviews();
    }
  }, [id]);

  const durationVideo =
    sessionData &&
    sessionData?.session?.session_data?.session_details?.duration;

  const sessionDate =
    sessionData && sessionData?.session?.session_data?.session_details?.date;
  const parsedSessionDate = sessionDate ? new Date(sessionDate) : null;
  const sessionTime =
    sessionData && sessionData?.session?.session_data?.session_details?.section;
  const sessionAmount =
    sessionData?.session?.session_data?.session_details?.amount;
  const {
    data: coachData,
    isLoading: isLoadingCoachData,
    isError: isErrorCoachData,
  } = useGetCoachByIdQuery({ id });
  const {
    data: sectionData,
    isLoading: isLoadingSectionData,
    isError: isErrorSectionData,
    refetch: refetchSectionData,
  } = useGetSectionByCoachQuery({ id });
  const {
    data: durationData,
    isLoading: isLoadingDurationData,
    isError: isErrorDurationData,
  } = useGetDurationQuery({ id });

  const duration = durationData?.duration?.details;
  const availability = sectionData?.sections;
  const data = coachData;

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`${SOCKET_URL}session/${session}`);
        const data = await response.json();
        console.log(data);
        if (data) {
          setSessionDataNew(data);
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();

    const socket = io(SOCKET_URL, {
      query: { userId: coachee?.user?.id },
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("coach-start-session", (socketData) => {
      console.log("Socket: ", socketData);
      if (socketData.coachStarted) {
        setSocketData({
          sessionId: socketData?.sessionId,
          coachStarted: socketData?.coachStarted,
        });
        setSessionDataNew((prevData) => ({
          ...prevData,
          coach_started: socketData.coachStarted,
        }));
        console.log("Coach has started the session");
        // toast.success(`Coach has started the session`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [session, id]);

  const coacheeData =
    JSON.parse(localStorage.getItem("loginUserData")) || undefined;
  const coachee = coacheeData?.user ? coacheeData?.user : coacheeData;

  const coacheeName = coachee?.first_name + " " + coachee?.last_name;

  const notify = (text) =>
    toast.success(text, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleDuration = () => {
    setDurationModal(false);
    setBookingModal(true);
    setCreateSessionError("");
  };
  const toggleDurationModal = () => {
    setDurationModal(!durationModal);
  };
  const toggleBookingModal = () => {
    setBookingModal(false);
  };
  notify();
  const handleSession = () => {
    const data = {
      duration: selectedDuration,
      section: time,
      coaching_area_id: selectCategory,
      amount: amount,
      date: format(selectedDate, "MM-dd-yyyy"),
      coach_id: id,
    };
    setLoading(true);
    setCreateSessionError("");
    authPost(`session/create`, data)?.then((res) => {
      if (!res?.success) {
        setLoading(false);
        setCreateSessionError(res?.message);
      } else {
        setCreateSessionError("");
        setLoading(false);
        setBookingModal(false);
        notify(t("Request submitted successfully"));
        // setTimeout(() => {
        //   navigate(`/coachee/coach-detail/${id}`);
        // }, 600);
        // setData(res);
      }
    });
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return false;
    }
    if (availability?.section_list === null) {
      return false;
    } else {
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayDetails = availability?.section_list[0]?.section_details[day];

      return dayDetails?.enabled;
    }
  };

  function convertTo12Hour(timeString) {
    return moment(timeString, "HH:mm").format("hh:mm A");
  }

  const getStartTimes = () => {
    if (!selectedDate) return [];

    // if (sessionData) {
    //   return [sessionTime];
    // }

    const day = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

    // Directly access the day details from the first section's details, assuming the structure is consistent
    const dayDetails = availability?.section_list?.[0]?.section_details[day];

    // Check if the day is enabled and has timeSessions
    if (dayDetails?.enabled) {
      return dayDetails.timeSessions.map((session) => session.start);
    }

    return [];
  };

  if (isLoadingCoachData) {
    return <Loader />;
  }

  // useEffect(() => {
  //   setTime('');
  // }, [selectedDate]);
  const sessionDetails = JSON.parse(sessionStorage.getItem("sessionDetails"));
  const handleSessionJoin = () => {
    if (!sessionDataNew?.coach_started) {
      toast.info(
        t("Kindly wait for the coach to begin the session before joining.")
      );
      return;
    } else {
      const sessionDetails = {
        sessionId: session,
        channelName: `${session}`,
        duration: durationVideo,
        users: users,
        localTracks: localTracks,
        role: "coachee",
      };
      sessionStorage.setItem(
        "sessionDetails",
        JSON.stringify({
          sessionId: session,
          channelName: sessionDetails?.channelName,
          duration: durationVideo,
          role: "coachee",
          username: coacheeName,
          coaching_area_name:
            sessionData?.session?.session_data?.coaching_area_name,
          coachId: id,
          coacheeId: coachee?.user?.id,
        })
      );
      localStorage.setItem("videoRoomData", JSON.stringify(sessionDetails));
      window.location.href = `/video-room`;
    }
  };

  const handleLeaveSession = () => {
    localTracks.forEach((track) => {
      track.stop();
      track.close();
    });

    console.log("Called me coachee details.....");
    setVideoModalOpen(false);
    setUsers([]);
    setJoined(false);
    sessionRefetch();
    // handleEndSession();
  };

  return (
    <>
      <div className="mb-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex">
            <ChevronLeft
              style={{ cursor: "pointer" }}
              size={30}
              onClick={() => navigate("/coachee/request")}
            />
            <h2 className="pb-2"> {t("Coach Details")} </h2>
          </div>
        </div>
        {/* {session && <button onClick={startSession}>Start Session</button>} */}
        <Row className="">
          <Col
            sm="12"
            md="12"
            lg="6"
            style={{
              paddingTop: "30px",
              borderRadius: "20px",
              marginRight: "8px",
              border: "2px solid #f8f8f8",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {" "}
            <div className="d-flex flex-wrap justify-content-between">
              <div className="d-flex">
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={data?.user?.profile_pic || defaultAvatar}
                    alt=""
                    style={{
                      height: "80px", // Set the desired height of the image
                      width: "80px", // Set the desired width of the image
                      objectFit: "cover", // Maintain aspect ratio and cover the container
                      borderRadius: "50%",
                    }}
                  />
                  {/* <Avatar
                    img={data?.user?.profile_pic || defaultAvatar}
                    imgHeight="60"
                    imgWidth="70"
                    // status="online"
                    style={{
                      // height: "100px", // Set the desired height of the image
                      // width: "100px", // Set the desired width of the image
                      objectFit: "cover", // Maintain aspect ratio and cover the container
                    }}
                  /> */}
                  {data?.user?.badges?.name !== "NULL" &&
                    data?.user?.badges?.name !== undefined && (
                      <img
                        src={getBadgeImage(data?.user?.badges?.name)}
                        alt="Badge"
                        style={{
                          position: "absolute",
                          right: "-10px",
                          bottom: "0px",
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: "transparent",
                          boxShadow: "unset",
                        }}
                      />
                    )}
                </div>
                <div style={{ marginLeft: "12px" }}>
                  <h2
                    style={{
                      fontSize: "19px",
                      color: "#0F6D6A",
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}
                  >
                    {data?.user?.first_name + " " + data?.user?.last_name}
                    {sessionData &&
                      sessionData?.session?.session_data?.session_details
                        ?.status !== "paid" && (
                        <span
                          style={{
                            marginLeft: "10px",
                            color: "#fff",
                            padding: "8px",
                            borderRadius: "10px",
                            fontSize: "14px",

                            backgroundColor:
                              sessionData?.session?.session_data
                                ?.session_details?.status === "accepted"
                                ? "#00B549"
                                : sessionData?.session?.session_data
                                    ?.session_details?.status === "pending"
                                ? "#D8AA04"
                                : sessionData?.session?.session_data
                                    ?.session_details?.status === "completed"
                                ? "#008000"
                                : "#FF463A",
                          }}
                        >
                          {t(
                            sessionData?.session?.session_data?.session_details
                              ?.status
                          )}
                        </span>
                      )}
                  </h2>
                  <h2>
                    <img src={filledStar} alt="Stars" width={30} /> {}
                    {avgRating && avgRating !== "NaN"
                      ? parseFloat(avgRating).toFixed(1)
                      : 0}
                  </h2>
                </div>
              </div>
              <div className="d-flex flex-column">
                {/* <Button
                  style={{ borderRadius: "35px", marginBottom: "10px" }}
                  color="danger"
                  onClick={toggleBook}
                >
                  Book Now
                </Button> */}
                <div className="align-self-end">
                  <div
                    style={{
                      marginLeft: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%",
                      backgroundColor: "#0F6D6A",
                      height: "40px",
                      width: "40px",
                      cursor: "pointer",
                    }}
                    onClick={
                      () =>
                        navigate(
                          `/chat-component?receiverId=${id}&first_name=${data.user.first_name}&last_name=${data.user.last_name}&profile_pic=${data.user.profile_pic}`
                        )
                      // navigate(
                      //   `/coachee/chat?contact_id=${data.user.id}&contact_first_name=${data.user.first_name}&profile_pic=${data.user.profile_pic}`
                      // )
                    }
                  >
                    <MessageCircle style={{ color: "#fff" }} />
                  </div>
                </div>
              </div>
            </div>
            {joined && (
              <>
                <Card
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // height: "100vh",
                    // maxWidth: "500p?x",
                  }}
                >
                  {/* <h4>Hello</h4> */}
                  <VideoRoom
                    channelName={`abc-${session}`} // Ensure this matches exactly what the coach uses
                    duration={durationVideo} // Assuming `duration` and `durationVideo` are intended to be the same
                    handleLeaveSession={handleLeaveSession}
                    users={users}
                    setUsers={setUsers}
                    localTracks={localTracks}
                    setLocalTracks={setLocalTracks}
                    role="coachee"
                    setVideoLoading={setVideoLoading}
                    videoLoading={videoLoading}
                  />
                </Card>
              </>
            )}
            <div className="d-flex flex-wrap justify-content-between mt-2">
              <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                {" "}
                {t("Category")}{" "}
              </p>
              <p>
                {" "}
                {data?.user?.coaching_areas?.map((int, index, array) =>
                  index === array.length - 1
                    ? lng === "ge"
                      ? int?.german_name
                      : int?.name
                    : lng === "ge"
                    ? int?.german_name
                    : int?.name + "-"
                )}
              </p>
            </div>
            <div className="d-flex flex-wrap justify-content-between">
              <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                {t("Languages")}
              </p>
              <p>
                {data?.user?.languages?.map((int, index, array) =>
                  index === array.length - 1 ? int : int + ","
                )}
              </p>
            </div>
            <div>
              <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                {" "}
                {t("About")}{" "}
              </p>
              <p>{data?.user?.about}</p>
            </div>
            {(sessionData?.session?.session_data?.session_details?.status ===
              "paid" ||
              sessionData?.session?.session_data?.session_details?.status ===
                "completed") && (
              <div className="my-2">
                <h2
                  style={{
                    color: "#0F6D6A",
                    fontWeight: "bold",
                  }}
                >
                  {t("Booked Session Details")}
                </h2>
                <div className="mb-1">
                  <span
                    style={{
                      color: "#0F6D6A",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    {t("Time")}:
                  </span>
                  <span>
                    {moment(
                      sessionData?.session?.session_data?.session_details
                        ?.section,
                      "HH:mm"
                    ).format("HH:mm A")}
                  </span>
                </div>
                <div className="mb-1">
                  <span
                    style={{
                      color: "#0F6D6A",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    {t("Category")}:
                  </span>
                  <span>
                    {sessionData?.session?.session_data?.coaching_area_name}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      color: "#0F6D6A",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    {t("Date")}:
                  </span>
                  <span>
                    {moment(
                      sessionData?.session?.session_data?.session_details?.date
                    ).format("DD/MM/YYYY")}
                  </span>
                </div>
              </div>
            )}
            {sessionData?.session?.session_data?.session_details?.status ===
              "accepted" && (
              <Button
                className="w-25"
                style={{ borderRadius: "35px" }}
                color="primary"
                onClick={() => togglePaymentModal(session)}
              >
                {t("Pay")}
              </Button>
            )}
            {sessionData?.session?.session_data?.session_details?.status ===
              "paid" && (
              <Button
                className="w-35"
                style={{ borderRadius: "35px" }}
                color="primary"
                onClick={handleSessionJoin}
                disabled={joined}
              >
                {!joined ? t("Join Session") : t("In Session")}
              </Button>
            )}
            {sessionData?.session?.session_data?.session_details?.status ===
              "completed" && (
              <Button
                className="w-45"
                style={{ borderRadius: "35px" }}
                color="primary"
                onClick={handleRateModal}
              >
                {isRatingExists ? t("Update Rating") : t("Rate Coach")}
              </Button>
            )}
            <hr />
            <div>
              <h3
                className="pt-2"
                style={{
                  fontWeight: "500",
                  marginBottom: "20px",
                  color: "#0f6d6a",
                }}
              >
                {t("Coach's Reviews")}
              </h3>
              {ratingLoading ? (
                <Spinner />
              ) : (
                <ReviewsComponent
                  reviewsData={reviewsData}
                  style={{
                    maxHeight: "300px",
                    overflowY: "scroll",
                    padding: "15px",
                  }}
                />
              )}
            </div>
          </Col>
          <Col
            sm="12"
            md="12"
            lg="5"
            style={{
              overflow: "hidden",
              paddingTop: "30px",
              borderRadius: "20px",
              // marginTop: "10px",
              border: "2px solid #f8f8f8",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-primary" style={{ fontWeight: "500" }}>
              {t("Book Session")}
            </h2>
            <h2
              className="text-primary"
              style={{ fontSize: "18px", fontWeight: "500" }}
            >
              {t("Select Category")}
            </h2>

            <Row>
              {availability?.coaching_area_list?.map((item, index) => (
                <Col key={index} style={{ marginBottom: "10px" }}>
                  {" "}
                  <Badge
                    disabled
                    onClick={() => {
                      // if (!session) {
                      setSelectCategory(item?.coaching_area_id);
                      // }
                    }}
                    color={
                      selectCategory === item?.coaching_area_id
                        ? "primary"
                        : "light"
                    }
                    className={
                      selectCategory === item?.coaching_area_id
                        ? "text-light"
                        : "text-dark"
                    }
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginRight: "0px !important",
                    }}
                  >
                    <img
                      src={item?.icon}
                      alt="Icon"
                      className="me-1"
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "0px !important",
                        // margin: "0 20px",
                      }}
                    />
                    {lng === "ge" ? item?.german_name : item?.name}
                  </Badge>
                </Col>
              ))}
            </Row>

            {/* <FullCalendar /> */}

            <div style={{ marginTop: "20px" }}>
              <h2
                className="text-primary"
                style={{ fontSize: "18px", fontWeight: "500" }}
              >
                {t("Booking Availability")}
              </h2>
              <div
                style={{
                  width: "100%",
                  textAlignLast: "center",
                }}
              >
                <ReactDatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    // if (!sessionData) {
                    setSelectedDate(date);
                    // }
                  }}
                  inline
                  filterDate={isDateDisabled}
                  className="form-control w-100"
                />
              </div>
            </div>
            <div>
              <h2
                className="text-primary"
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
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
                    className={
                      time === row ? "text-light mt-1" : "text-dark mt-1"
                    }
                    style={{
                      fontSize: "14px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  >
                    {convertTo12Hour(row)}
                  </Badge>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "center", margin: "20px" }}>
              {" "}
              {/* {!sessionData && ( */}
              <Button
                disabled={!time || !selectCategory}
                style={{ borderRadius: "35px" }}
                color="primary"
                onClick={() => setDurationModal(true)}
              >
                {t("Request Session")}
              </Button>
              {/* )} */}
            </div>
          </Col>
        </Row>

        {/* ******************************** */}

        <BookNow
          isOpen={isBookModal}
          setIsBookModal={setIsBookModal}
          toggle={toggleBook}
          availability={availability}
          selectCategory={selectCategory}
          setSelectCategory={setSelectCategory}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isDateDisabled={isDateDisabled}
          getStartTimes={getStartTimes}
          time={time}
          setTime={setTime}
          setDurationModal={setDurationModal}
          convertTo12Hour={convertTo12Hour}
        />

        <Modal
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          isOpen={durationModal}
          toggle={toggleDurationModal}
        >
          <ModalHeader toggle={toggleDurationModal}>
            {" "}
            <p style={{ fontWeight: "Bold", fontSize: "18px" }}>
              {t("Choose Duration")}
            </p>
          </ModalHeader>

          <>
            {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}
            <div
              className="mb-1 pt-0 p-2"
              style={{ textAlign: "-webkit-center" }}
            >
              {durationData?.duration?.details && // Make sure to access the .details property of your duration object
                durationData?.duration?.details
                  ?.filter((item) => item?.amount) // Filter items based on the amount
                  .map((item, index) => (
                    <div
                      key={index}
                      className="justify-content-between mt-2"
                      style={{
                        // width: "325px",
                        backgroundColor: "#EEEEEE",
                        padding: "1px",
                        paddingRight: "10px",
                        paddingLeft: "10px",
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedDuration(item?.value);
                        setAmount(item?.amount);
                      }}
                    >
                      <div className="d-flex justify-content-between mt-2 pb-1">
                        <Label className="form-check-label" disabled>
                          {`${item?.value} ${t("minutes")} (${
                            item?.amount
                          } CHF)`}
                        </Label>
                        <Input
                          disabled={!item?.amount}
                          value={item?.value} // Assuming you want to use item?.value as the value attribute
                          onChange={() => {
                            setSelectedDuration(item?.value);
                            setAmount(item?.amount);
                          }}
                          checked={selectedDuration === item?.value}
                          type="checkbox"
                          id={`remember-me-${index}`} // Updated to use index for unique IDs
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </>

          <ModalFooter className="justify-content-center">
            <Button
              style={{ borderRadius: "35px" }}
              disabled={!selectedDuration}
              color="primary"
              className="justify-content-center w-75"
              onClick={handleDuration}
            >
              {t("Continue")}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          isOpen={bookingModal}
          toggle={toggleBookingModal}
          size="md"
        >
          <ModalHeader toggle={toggleBookingModal}>
            {" "}
            <p
              style={{
                fontWeight: "500",
                fontSize: "18px",
                marginTop: "15px",
                color: "#0F6D6A",
              }}
            >
              {" "}
              {t("Review Booking")}
            </p>
          </ModalHeader>

          <>
            {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}
            <div className="mb-1  ">
              {createSessionError && (
                <Alert color="danger">{createSessionError}</Alert>
              )}
              <div
                className="d-flex align-items-center"
                style={{ marginTop: "20px" }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <Avatar
                    style={{ height: "60px", marginLeft: "10px" }}
                    className="ml-2"
                    img={data?.user?.profile_pic || defaultAvatar}
                    imgHeight="60"
                    imgWidth="60"
                    // status="onli
                  />
                  {data?.user?.badges?.name && (
                    <img
                      src={getBadgeImage(data?.user?.badges?.name)}
                      alt="Badge"
                      style={{
                        position: "absolute",
                        right: "-10px",
                        bottom: "0px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "transparent",
                        boxShadow: "unset",
                      }}
                    />
                  )}
                </div>
                <div style={{ marginLeft: "12px" }}>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#0F6D6A",
                      fontWeight: "500",
                    }}
                  >
                    {data?.user?.first_name + " " + data?.user?.last_name}
                  </h2>
                  <h2 className="d-flex">
                    <img src={filledStar} alt="" width={30} height={30} />
                    <p style={{ fontSize: "18px", padding: "2px" }}>
                      {avgRating && avgRating !== "NaN"
                        ? parseFloat(avgRating).toFixed(1)
                        : 0}
                    </p>
                  </h2>
                </div>
              </div>
              <div style={{ marginLeft: "12px", marginRight: "15px" }}>
                <div className="d-flex justify-content-between mt-2">
                  <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                    {t("Category")}
                  </p>
                  <p>
                    {availability?.coaching_area_list
                      ?.filter(
                        (item) => item?.coaching_area_id === selectCategory
                      )
                      ?.map((item) =>
                        lng === "ge" ? item?.german_name : item?.name
                      )}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                    {t("Date")}
                  </p>
                  <p>{format(selectedDate, "dd/MM/yyyy")}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                    {t("Time")}
                  </p>
                  <p>{convertTo12Hour(time)}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                    {t("Session Type")}
                  </p>
                  <p>
                    {selectedDuration +
                      t("minutes") +
                      " ( " +
                      t("amount") +
                      " CHF )"}
                  </p>
                </div>
              </div>
            </div>
          </>

          <ModalFooter className="justify-content-center">
            <Button
              color="primary"
              style={{ borderRadius: "35px" }}
              className="justify-content-center w-75"
              onClick={handleSession}
            >
              {loading ? <Spinner size="sm" /> : t("Request Session")}
            </Button>
          </ModalFooter>
        </Modal>
        <CardPayment
          amount={amount}
          paymentModal={paymentModal}
          setPaymentModal={setPaymentModal}
          session={sessionData?.session?.session_data?.session_id}
        />
        {/* <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        /> */}
        {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          maxWidth: "600%",
        }}
      > */}
        {/* <>
        <Modal
          isOpen={videoModalOpen}
          toggle={() => setVideoModalOpen(!videoModalOpen)}
          size="lg"
          keyboard={false}
          backdrop="static"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <ModalBody>
            {joined && (
              <VideoRoom
                channelName={CHANNEL_NAME}
                duration={durationVideo}
                users={users}
                handleLeaveSession={handleLeaveSession}
                localTracks={localTracks}
                setUsers={setUsers}
                setLocalTracks={setLocalTracks}
                setVideoLoading={setVideoLoading}
                videoLoading={videoLoading}
                setVideoModalOpen={setVideoModalOpen}
                handleEndSession={handleEndSession}
              />
            )}
          </ModalBody>
        </Modal>
      </> */}

        {/* </div> */}
        {/* {videoLoading && <Loader />} */}
      </div>

      <RateModal
        isRateModal={isRateModal}
        handleRateModal={handleRateModal}
        isRatingExists={isRatingExists}
        coachId={id}
        sessionsId={sessionID}
        ratingData={ratingData}
        checkReviewExists={checkReviewExists}
        fetchCoachReviews={fetchCoachReviews}
        fetchAvgRating={fetchAvgRating}
      />
      <PaymentModal
        isOpen={isPaymentModal}
        toggle={togglePaymentModal}
        coach_id={id}
        session_id={session}
        amount={sessionAmount}
        refetch={sessionRefetch}
        date={sessionData?.session?.session_data?.session_details?.date}
        time={sessionData?.session?.session_data?.session_details?.duration}
      />
      {sessionData?.session?.session_data?.session_details?.status ===
        "completed" &&
        sessionCompleted === "true" && (
          <SessionEndModal
            isOpen={isOpenSessionEndModal}
            toggle={toggleSessionEndModal}
            handleRateModal={handleRateModal}
            name={data?.user?.first_name + " " + data?.user?.last_name}
          />
        )}
    </>
  );
};

export default CoachDetail;
