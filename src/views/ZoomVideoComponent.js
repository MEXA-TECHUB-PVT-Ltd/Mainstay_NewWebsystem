import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { APP_ID } from "../utility/Utils";

const CHANNEL_NAME = "MainStays";
const TEMP_TOKEN = null;

const VideoSession = () => {
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const localVideoRef = useRef(null);
  const agoraClient = useRef(null);
  const localVideoTrack = useRef(null);
  const localAudioTrack = useRef(null);
  const handleUserPublished = async (user, mediaType) => {
    await agoraClient.current.subscribe(user, mediaType);
    if (mediaType === "video") {
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

  const startOrJoinSession = async (role) => {
    agoraClient.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await agoraClient.current.join(APP_ID, CHANNEL_NAME, TEMP_TOKEN, null);
    agoraClient.current.on("user-published", async (user, mediaType) => {
      await handleUserPublished(user, mediaType);
    });
    agoraClient.current.on("user-unpublished", handleUserUnpublished);
    const [audioTrack, videoTrack] = await Promise.all([
      AgoraRTC.createMicrophoneAudioTrack(),
      AgoraRTC.createCameraVideoTrack(),
    ]);
    localAudioTrack.current = audioTrack;
    localVideoTrack.current = videoTrack;
    videoTrack.play(localVideoRef.current);
    await agoraClient.current.publish([audioTrack, videoTrack]);
    setJoined(true);
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

  return (
    <div>
      <div>
        <button onClick={() => startOrJoinSession("coach")} disabled={joined}>
          Start Session as Coach
        </button>
        <button onClick={() => startOrJoinSession("coachee")} disabled={joined}>
          Join Session as Coachee
        </button>
        <button onClick={leaveSession} disabled={!joined}>
          Leave Session
        </button>
      </div>
      <div
        id="local-stream"
        ref={localVideoRef}
        style={{ width: "320px", height: "240px", backgroundColor: "black" }}
      ></div>
      {remoteUsers.map((uid) => (
        <div
          key={uid}
          id={`remote-stream-${uid}`}
          style={{ width: "320px", height: "240px", backgroundColor: "black" }}
        >
          <video
            autoPlay
            playsInline
            id={`video-${uid}`}
            style={{ width: "100%", height: "100%" }}
          ></video>
        </div>
      ))}
    </div>
  );
};

export default VideoSession;
