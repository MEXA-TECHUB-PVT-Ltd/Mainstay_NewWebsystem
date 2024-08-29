import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { SOCKET_URL, post, put } from "../urls/api";
import Loader from "./Loader";
import SessionResponseModalDetails from "./SessionResponseModalDetails";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { VideoRoom } from "../views/callingSmaple/videoRoom";
import "./session-video.css";
import { ToastContainer, toast } from "react-toastify";
import { setSessionData } from "../redux/videoSessionSlice";
import { useSelector } from "react-redux";
import { setCoachStarted, setSessionId } from "../redux/navbar";
import SessionEndModal from "../@core/layouts/components/menu/vertical-menu/SessionEndModal";
import { useTranslation } from "react-i18next";

let socket;
const SessionResponse = ({
  requestModal,
  setRequestModal,
  data,
  acceptedSessionError,
  setAcceptedSessionError,
  fetchData,
  // joined,
  // setJoined,
  // videoLoading,
  // setVideoModalOpen,
  // handleLeaveSession,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  console.log("sesseion-data", data);
  const dispatch = useDispatch();
  const duration = data?.session_info?.session_details?.duration;
  const sessionId = useSelector((state) => state.navbar.sessionId);
  const coachStarted = useSelector((state) => state.navbar.coachStarted);

  const state = useSelector((state) => state);
  console.log(state);

  useEffect(() => {
    socket = io(SOCKET_URL, {
      query: { userId: data?.session_info?.coach_id },
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("coach-start-session", (data) => {
      console.log("Socket event received: ", data);
      if (data.coachStarted) {
        setJoined(true);
        setVideoModalOpen(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [data?.session_info?.coach_id]);

  const toggleRequestModal = () => {
    setAcceptedSessionError("");
    setRequestModal(!requestModal);
  };
  const handleSession = (action) => {
    // let data;
    console.log("from here session will be accept or reject");
    console.log(action);
    // return null;
    setLoading(true);
    put(
      `session/status-update/${data?.session_info?.session_details?.session_id}`,
      {
        status: action,
        date: data?.session_info?.session_details?.date,
        section: data?.session_info?.session_details?.section,
      }
    ).then((res) => {
      console.log("res", res);
      if (!res.success) {
        setLoading(false);
        setAcceptedSessionError(res?.message);
      }
      if (res.success) {
        setLoading(false);
        // data = {
        //   notification_title: "Session Request Accepted",
        //   notification_content: `You're session requested is accepted`,
        //   user_id: res.updatedSession.coachee_id,
        //   user_type: "coach",
        //   session_id: res.updatedSession.section_id,
        //   coach_area_id: res.updatedSession.coaching_area_id,
        // };
        if (fetchData) {
          fetchData();
        }
        setRequestModal(false);
        setLoading(false);
        console.log(data);
        if (action === "accepted") {
          const notificationData = {
            title: "SESSION_ACCEPTED",
            content: "Your session has been accepted by coach.",
            type: "SESSION",
            coach_id: data?.session_info?.coach_id,
            coachee_id: data?.session_info?.coachee_id,
            session_id: data?.session_info?.session_details?.session_id,
          };
          toast.success(t("Session Accepted"), {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          post("notifications/create", notificationData)
            .then((response) => console.log("Notification response", response))
            .catch((error) =>
              console.log("Error creating notification", error)
            );
        }
      }
      // post("notifications/create", notificationData)
      //   .then((response) => console.log("Notification response", response))
      //   .catch((error) => console.log("Error creating notification", error));
      if (action === "rejected") {
        toast.success(t("Session Rejected"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        post("notifications/create", notificationData)
          .then((response) => console.log("Notification response", response))
          .catch((error) => console.log("Error creating notification", error));
      }
      if (action === "completed") {
        const notificationData = {
          title: "REVIEW_SESSION",
          content: "Review the session.",
          type: "SESSION",
          coach_id: data?.session_info?.coach_id,
          coachee_id: data?.session_info?.coachee_id,
          session_id: data?.session_info?.session_details?.session_id,
        };
        post("notifications/create", notificationData)
          .then((response) => console.log("Notification response", response))
          .catch((error) => console.log("Error creating notification", error));
      }
    });
  };
  const handleStartSession = async () => {
    const notificationData = {
      title: "SESSION_STARTED",
      content: "Your session has been started.",
      type: "SESSION",
      coach_id: data?.session_info?.coach_id,
      coachee_id: data?.session_info?.coachee_id,
      session_id: data?.session_info?.session_details?.session_id,
    };
    post("notifications/create", notificationData)
      .then((response) => {
        const sessionDetails = {
          sessionId: data?.session_info?.session_details?.session_id,
          channelName: `${data?.session_info?.session_details?.session_id}`,
          duration: duration,
          users: users,
          localTracks: localTracks,
          role: "coach",
        };
        const sessionId = data?.session_info?.session_details?.session_id;
        const channelName = `${data?.session_info?.session_details?.session_id}`;
        socket.emit("coach-start-session", { sessionId, coachStarted: true });
        sessionStorage.setItem(
          "sessionDetails",
          JSON.stringify({
            sessionId: sessionId,
            channelName: channelName,
            duration: sessionDetails?.duration,
            role: "coach",
            username: data?.session_info?.coach_name,
            coaching_area_name: data?.session_info?.coaching_area_name,
            coachId: data?.session_info?.coach_id,
            coacheeId: data?.session_info?.coachee_id,
          })
        );
        window.location.href = `/video-room`;
      })
      .catch((error) => console.log("Error creating notification", error));
  };

  return (
    <>
      <Modal
        isOpen={requestModal}
        toggle={toggleRequestModal}
        backdrop={joined ? "static" : true}
        keyboard={!joined}
        className={`${joined ? "custom-modal" : ""}`}
        size={`${joined ? "xl" : "lg"}`}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {loading && <Loader />}
        {videoLoading && <Loader />}
        <ModalBody>
          {acceptedSessionError && (
            <Alert color="danger">{acceptedSessionError}</Alert>
          )}
          {!joined && (
            <SessionResponseModalDetails
              data={data}
              toggleRequestModal={toggleRequestModal}
              handleSession={handleSession}
            />
          )}
        </ModalBody>
        <ModalFooter>
          {data?.session_info?.session_details?.status === "paid" &&
            !joined && (
              <Button color="primary" onClick={handleStartSession}>
                {t("Start Session")}
              </Button>
            )}
        </ModalFooter>
      </Modal>
      {/* <ToastContainer /> */}
    </>
  );
};

export default SessionResponse;
