import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { put } from "../urls/api";
import Loader from "./Loader";

import AgoraRTC from "agora-rtc-sdk-ng";
import { APP_ID } from "./Utils";
import SessionResponseModalDetails from "./SessionResponseModalDetails";
import "./session-video.css";
import io from "socket.io-client";
import { VideoRoom } from "../views/callingSmaple/videoRoom";

const SessionResponse = ({ requestModal, setRequestModal, data }) => {
  const [loading, setLoading] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5019");
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const toggleRequestModal = () => {
    setRequestModal(!requestModal);
  };

  const handleSession = (action) => {
    put(
      `session/status-update/${data?.session_info?.session_details?.session_id}`,
      {
        status: action,
      }
    ).then((res) => {
      setRequestModal(false);
      setLoading(false);
    });
  };

  const CHANNEL_NAME = "abc";
  // const CHANNEL_NAME = "abc-" + data?.session_info?.session_details?.session_id;
  const TEMP_TOKEN = null;
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const localVideoRef = useRef(null);
  const agoraClient = useRef(null);
  const localVideoTrack = useRef(null);
  const localAudioTrack = useRef(null);

  console.log(remoteUsers);

  const handleUserPublished = async (user, mediaType) => {
    await agoraClient.current.subscribe(user, mediaType);
    console.log("HANDLE PUBLISHED");
    if (mediaType === "video") {
      console.log("USer++-pipio", user);
      setRemoteUsers((prevUsers) => [...prevUsers, user.uid]);
      setTimeout(() => {
        user.videoTrack.play(`video-${user.uid}`);
      }, 0);
    } else if (mediaType === "audio") {
      console.log(`Subscribed to audio track for uid: ${user.uid}`);
    }
  };
  const handleUserUnpublished = (user) => {
    setRemoteUsers((prevUsers) => prevUsers.filter((uid) => uid !== user.uid));
  };

  const startSession = async () => {
    agoraClient.current = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    });
    try {
      await agoraClient.current.join(APP_ID, CHANNEL_NAME, TEMP_TOKEN, null);
      // const [audioTrack, videoTrack] = await Promise.all([
      //   AgoraRTC.createMicrophoneAudioTrack(),
      //   AgoraRTC.createCameraVideoTrack(),
      // ]);

      // localAudioTrack.current = audioTrack;
      // localVideoTrack.current = videoTrack;
      // videoTrack.play(localVideoRef.current);

      // await agoraClient.current.publish([audioTrack, videoTrack]);

      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();

      // Play the local video track
      if (localVideoRef.current) {
        localVideoTrack.current.play(localVideoRef.current);
      }

      await agoraClient.current.publish([
        localVideoTrack.current,
        localAudioTrack.current,
      ]);

      agoraClient.current.on("user-published", async (user, mediaType) => {
        console.log("ksjdkfj😀😀😀");
        console.log("User details: ", user, mediaType);
        await handleUserPublished(user, mediaType);
      });
      agoraClient.current.on("user-unpublished", handleUserUnpublished);

      setJoined(true);
      console.log("Joined session successfully.");
    } catch (error) {
      console.error("Failed to join session", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const leaveSession = async () => {
    if (joined) {
      if (
        localAudioTrack.current &&
        typeof localAudioTrack.current.stop === "function"
      ) {
        await localAudioTrack.current.stop();
        localAudioTrack.current.close();
      }
      if (
        localVideoTrack.current &&
        typeof localVideoTrack.current.stop === "function"
      ) {
        await localVideoTrack.current.stop();
        localVideoTrack.current.close();
      }
      await agoraClient.current.leave();
      setJoined(false);
      setRemoteUsers([]);
      localAudioTrack.current = null;
      localVideoTrack.current = null;
      // // Remove all remote user containers
      // document.getElementById("remote-streams").innerHTML = "";
    }
  };

  useEffect(() => {
    return () => {
      leaveSession().catch(console.error);
    };
  }, []);

  return (
    <Modal isOpen={requestModal} toggle={toggleRequestModal} size="lg">
      {loading && <Loader />}
      <ModalBody>
        <SessionResponseModalDetails
          data={data}
          toggleRequestModal={toggleRequestModal}
          handleSession={handleSession}
        />
        {!joined && <button onClick={() => setJoined(true)}>Join Room</button>}

        {joined && <VideoRoom channelName={CHANNEL_NAME} />}
        <div className="video-call-container">
          <div
            id="local-stream"
            ref={localVideoRef}
            style={{
              width: "320px",
              height: "240px",
              backgroundColor: "black",
            }}
          ></div>
          {remoteUsers.map((uid) => (
            <div
              key={uid}
              id={`remote-stream-${uid}`}
              style={{
                width: "320px",
                height: "240px",
                backgroundColor: "black",
              }}
            >
              <video
                autoPlay
                playsInline
                id={`video-${uid}`}
                style={{ width: "100%", height: "100%" }}
              ></video>
            </div>
          ))}
          {/* <div
            id="local-stream"
            ref={localVideoRef}
            className="video-stream local-stream"
          ></div>
          <div id="remote-streams" className="remote-streams"></div> */}
        </div>
      </ModalBody>
      {data?.session_info?.session_details?.status === "paid" && (
        <ModalFooter>
          <Button color="primary" onClick={startSession} disabled={joined}>
            {joined ? "In Session" : "Start Session"}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export default SessionResponse;

// *********************

// ********************************** START VIDEO CALLING ********************************
const CHANNEL_NAME = "abc-" + sessionData?.session?.session_data?.session_id;
const TEMP_TOKEN = null;

const [joined, setJoined] = useState(false);
const [remoteUsers, setRemoteUsers] = useState([]);
const localVideoRef = useRef(null);
const agoraClient = useRef(null);
const localVideoTrack = useRef(null);
const localAudioTrack = useRef(null);
const handleUserPublished = async (user, mediaType) => {
  await agoraClient.current.subscribe(user, mediaType);
  console.log("HANDLE PUBLISHED");
  if (mediaType === "video") {
    console.log("USer++-pipio", user);
    setRemoteUsers((prevUsers) => [...prevUsers, user.uid]);
    setTimeout(() => {
      user.videoTrack.play(`video-${user.uid}`);
    }, 0);
  } else if (mediaType === "audio") {
    console.log(`Subscribed to audio track for uid: ${user.uid}`);
  }
};
const handleUserUnpublished = (user) => {
  setRemoteUsers((prevUsers) => prevUsers.filter((uid) => uid !== user.uid));
};

const joinSession = async () => {
  agoraClient.current = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  try {
    // Join the session using AgoraRTC. Replace TEMP_TOKEN with a valid token for production.
    await agoraClient.current.join(APP_ID, CHANNEL_NAME, TEMP_TOKEN, null);

    // Create and initialize the local video and audio tracks
    localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
    localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();

    // Play the local video track
    if (localVideoRef.current) {
      localVideoTrack.current.play(localVideoRef.current);
    }

    await agoraClient.current.publish([
      localVideoTrack.current,
      localAudioTrack.current,
    ]);
    console.log("Going to handle the user publish event");
    agoraClient.current.on("user-published", async (user, mediaType) => {
      console.log("ksjdkfj😀😀😀");
      console.log("User details: ", user, mediaType);
      await handleUserPublished(user, mediaType);
    });
    agoraClient.current.on("user-unpublished", handleUserUnpublished);

    setJoined(true);
    console.log("Joined session successfully.");
  } catch (error) {
    console.error("Failed to join session", error);
    // Handle error (e.g., show an error message to the user)
  }
};

const leaveSession = async () => {
  if (joined) {
    if (
      localAudioTrack.current &&
      typeof localAudioTrack.current.stop === "function"
    ) {
      await localAudioTrack.current.stop();
      localAudioTrack.current.close();
    }
    if (
      localVideoTrack.current &&
      typeof localVideoTrack.current.stop === "function"
    ) {
      await localVideoTrack.current.stop();
      localVideoTrack.current.close();
    }
    await agoraClient.current.leave();
    setJoined(false);
    setRemoteUsers([]);
    localAudioTrack.current = null;
    localVideoTrack.current = null;
  }
};

useEffect(() => {
  return () => {
    leaveSession().catch(console.error);
  };
}, []);

// ********************************** END VIDEO CALLING ********************************
