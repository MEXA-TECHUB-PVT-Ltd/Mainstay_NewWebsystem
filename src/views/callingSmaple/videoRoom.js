import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import { APP_ID } from "../../utility/Utils";
import { Badge, Button } from "reactstrap";
import Loader from "../../utility/Loader";
import { Mic, MicOff, PhoneOff } from "react-feather";

import io from "socket.io-client";
import { SOCKET_URL } from "../../urls/api";

const socket = io(`${SOCKET_URL}`);

const TOKEN = null;

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export const VideoRoom = ({
  channelName,
  durations,
  handleLeaveSession,
  users,
  setUsers,
  localTracks,
  setLocalTracks,
  role,
}) => {
  const { t } = useTranslation();
  console.log("ROLE: ", role);
  // console.log(durations);
  const duration = 15;
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    console.log("remainingSeconds useEffect");
    const startCountdown = (remainingSeconds) => {
      console.log("remainingSeconds", remainingSeconds);
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
      console.log("Session started:", data);
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
  }, [durations, role, channelName]);

  const toggleMuteAudio = () => {
    if (localTracks.length > 0) {
      const audioTrack = localTracks.find(
        (track) => track.trackMediaType === "audio"
      );
      if (audioTrack) {
        const newState = !isAudioMuted;
        audioTrack.setEnabled(!newState);
        setIsAudioMuted(newState);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const handleUserJoined = async (user, mediaType) => {
    console.log("handle join");
    console.log("User joined: ", user, "MediaType: ", mediaType);
    if (users.length >= 2) {
      console.log("Maximum participants reached.");
      return; // Stop further execution if there are already two participants
    }
    await client.subscribe(user, mediaType);
    console.log("Subscription successful");

    if (mediaType === "video" || mediaType === "audio") {
      setUsers((previousUsers) => [
        ...previousUsers,
        {
          uid: user.uid,
          videoTrack: user.videoTrack,
          audioTrack: user.audioTrack,
        },
      ]);

      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  let isJoined = false;
  let timer;

  const joinChannel = async () => {
    try {
      client.on("user-published", handleUserJoined);
      client.on("user-left", handleUserLeft);

      const uid = await client.join(APP_ID, channelName, TOKEN, null);
      isJoined = true;

      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks(tracks);
      await client.publish(tracks);

      const [audioTrack, videoTrack] = tracks;
      setUsers((previousUsers) => [
        ...previousUsers,
        {
          uid,
          videoTrack,
          audioTrack,
          role,
        },
      ]);
    } catch (error) {
      console.error("Failed to join Agora channel:", error);
    }
  };

  useEffect(() => {
    // if (client.connectionState !== "DISCONNECTED") {
    //   console.log(
    //     "Client is already connected or connecting. Current state:",
    //     client.connectionState
    //   );
    //   return;
    // }
    // if (client.connectionState === "DISCONNECTED") {
    joinChannel();
    // }

    return () => {
      clearTimeout(timer);
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      if (isJoined) {
        client.leave();
        // handleLeaveSession();
      }

      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
    };
  }, [channelName, duration]);

  useEffect(() => {
    if (sessionTimeout) {
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });
      client.leave().then(() => {
        // handleLeaveSession();
      });
    }
  }, [sessionTimeout]);

  console.log("users, ", users);
  const swapVideos = (index1, index2) => {
    console.log("swappedusers, ", users);
    setUsers((currentUsers) => {
      let newUsers = [...currentUsers];
      [newUsers[index1], newUsers[index2]] = [
        newUsers[index2],
        newUsers[index1],
      ];
      return newUsers;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "40px",
        left: "0",
        zIndex: 9999,
      }}
    >
      <>
        <div style={{ width: "100%" }}>
          <div style={{ position: "relative" }}>
            {users?.map((user, index) => (
              <div
                key={user.uid}
                onClick={() => swapVideos(0, index)}
                style={{
                  position: index === 0 ? "static" : "absolute",
                  bottom: index === 0 ? "auto" : "5px",
                  right: index === 0 ? "auto" : "0",
                  height: index === 0 ? "auto" : "150px",
                  cursor: index === 0 ? "" : "pointer",
                }}
              >
                <VideoPlayer user={user} />
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                top: "200px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                background: "#fff",
                padding: "5px 10px",
                borderRadius: "10px",
              }}
            >
              {sessionTimeout ? t("Session Ended") : formatTime(remainingTime)}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                color="danger"
                onClick={handleLeaveSession}
                style={{
                  marginRight: "20px", // Space between buttons
                  padding: "4px 12px", // Smaller button
                }}
              >
                <PhoneOff size={16} /> {/* Smaller icon */}
                {/* End Session */}
              </Button>
              <Button
                color={isAudioMuted ? "secondary" : "warning"}
                onClick={toggleMuteAudio}
                style={{
                  padding: "4px 12px", // Smaller button
                }}
              >
                {isAudioMuted ? <MicOff size={16} /> : <Mic size={16} />}{" "}
                {/* {isAudioMuted ? "Unmute" : "Mute"} */}
              </Button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};
