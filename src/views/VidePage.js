import React, { useEffect, useRef, useState } from "react";
import AgoraUIKit, { layout } from "agora-react-uikit";
import "agora-react-uikit/dist/index.css";
import { APP_ID } from "../utility/Utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import moment from "moment";
import { SOCKET_URL, post, put } from "../urls/api";
import { useTranslation } from "react-i18next";

const socket = io(`${SOCKET_URL}`);

const VideoPage = () => {
  const [videocall, setVideocall] = useState(true);
  const [isPinned, setPinned] = useState(false);
  const { t } = useTranslation();
  // const [isPinned, setPinned] = useState(false);

  const [searchParams] = useSearchParams();
  const sessionDetails = JSON.parse(sessionStorage.getItem("sessionDetails"));
  console.log(sessionDetails);
  const sessionId = searchParams.get("sessionId") || sessionDetails?.sessionId;
  const channelName =
    searchParams.get("channelName") || sessionDetails?.channelName;
  const role = searchParams.get("role") || sessionDetails?.role;
  const username = searchParams.get("username") || sessionDetails?.username;
  const coaching_area_name =
    searchParams.get("coaching_area_name") ||
    sessionDetails?.coaching_area_name;
  const duration =
    searchParams.get("duration") || parseInt(sessionDetails?.duration, 10);
  // const duration = parseInt(searchParams.get("duration"), 10); // convert minutes to seconds
  // const duration = 1; // convert minutes to seconds
  const coachId =
    parseInt(searchParams.get("coachId"), 10) || sessionDetails?.coachId; // convert minutes to seconds
  const coacheeId =
    parseInt(searchParams.get("coacheeId"), 10) || sessionDetails?.coacheeId; // convert minutes to seconds
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const intervalIdRef = useRef(null);
  const navigate = useNavigate();

  const durationInSeconds = duration * 60;
  const [remainingTime, setRemainingTime] = useState(durationInSeconds);

  useEffect(() => {
    const startCountdown = (remainingSeconds) => {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = setInterval(() => {
        remainingSeconds--;
        if (remainingSeconds <= 0) {
          clearInterval(intervalIdRef.current);
          setSessionTimeout(true);
          setRemainingTime(0);
        } else {
          setRemainingTime(remainingSeconds);
        }
      }, 1000);
    };

    socket.on("session started", (data) => {
      const remainingSeconds = Math.floor((data.endTime - Date.now()) / 1000);
      startCountdown(remainingSeconds);
    });

    socket.on("time update", (data) => {
      if (data.sessionId === channelName) {
        const remainingSeconds = Math.floor(data.remainingTime / 1000);
        startCountdown(remainingSeconds);
      }
    });

    if (role === "coach") {
      socket.emit("start session", { sessionId: channelName, duration });
    } else if (role === "coachee") {
      socket.emit("request time", { sessionId: channelName });
    }

    return () => {
      clearInterval(intervalIdRef.current);
      socket.off("session started");
      socket.off("time update");
    };
  }, [duration, role, channelName]);

  useEffect(() => {
    if (sessionTimeout) {
      handleVideoEnd();
      sessionStorage.removeItem("sessionDetails");
    }
  }, [sessionTimeout]);

  const formatTime = (seconds) => {
    return moment.utc(seconds * 1000).format("HH:mm:ss");
  };

  const handleCompleteSession = (action) => {
    put(`session/status-update/${sessionId}`, {
      status: action,
    })
      .then((res) => {
        console.log("Completed session", res);
        const notificationData = {
          title: "SESSION_ENDED",
          content: t("Review the session."),
          type: "SESSION",
          coach_id: coachId,
          coachee_id: coacheeId,
          session_id: sessionId,
        };
        post("notifications/create", notificationData)
          .then((response) => {
            console.log("notification response", response);
            navigate("/coach/coaching?status=SESSION_REVIEW");
            sessionStorage.setItem("sessionCompleted", "true");
          })
          .catch((error) => console.log("Error creating notification", error));
      })
      .catch((err) => console.log(err));
  };

  const handleVideoEnd = async () => {
    sessionStorage.removeItem("sessionDetails");
    if (role === "coach") {
      handleCompleteSession("completed");
    }
    if (role === "coachee") {
      sessionStorage.setItem("sessionCompleted", "true");
      navigate(`/coachee/coach-detail/${coachId}?session=${sessionId}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer} className="ui-class-test">
        <div style={styles.nav}>
          <div style={styles.sessionInfo}>
            <span> {t("Session Category:")} </span>
            <span style={styles.boldText}>{coaching_area_name}</span>
          </div>
          <div style={styles.sessionTime}>
            <span style={styles.timeText}> {t("Session Duration")} </span>
            <p style={styles.btn}>{formatTime(remainingTime)}</p>
          </div>
          <p style={styles.btns} onClick={() => setPinned(!isPinned)}>
            {t("Change Layout")}
          </p>
        </div>
        <AgoraUIKit
          rtcProps={{
            appId: APP_ID,
            channel: channelName,
            token: null,
            layout: isPinned ? layout.pin : layout.grid,
            enableScreensharing: true,
          }}
          rtmProps={{
            username: username === "null null" ? "user" : username,
            displayUsername: true,
          }}
          callbacks={{
            EndCall: () => handleVideoEnd(),
          }}
          styleProps={{
            localBtnContainer: {
              backgroundColor: "#0F6D6A",
              justifyContent: "center",
              gap: "20px",
            },
          }}
        />
      </div>
    </div>
  );
};

export const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0F6D6A",
    color: "#FFFF",
  },
  videoContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 20px",
    backgroundColor: "#0F6D6A",
  },
  sessionInfo: {
    display: "flex",
    alignItems: "center",
    color: "#FFFF",
  },
  sessionTime: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    marginLeft: "5px",
  },
  timeText: {
    fontSize: "16px",
    color: "#FFFF",
  },
  btn: {
    backgroundColor: "#DCEBEB",
    borderRadius: 5,
    padding: "4px 8px",
    color: "#0F6D6A",
    fontSize: "20px",
    marginTop: "5px",
  },
  btns: {
    backgroundColor: "#DCEBEB",
    borderRadius: 5,
    padding: "4px 8px",
    color: "#0F6D6A",
    fontSize: "20px",
    marginTop: "5px",
    cursor: "pointer",
  },
};

export default VideoPage;
