import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import { APP_ID } from "../../utility/Utils";

const TOKEN = null;

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export const VideoRoom = ({
  channelName,
  duration, // Duration is expected to be in minutes
  handleLeaveSession,
  users,
  localTracks,
  setUsers,
  setLocalTracks,
  handleEndSession,
}) => {
  console.log(duration); // Log the duration for debugging
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }
    // Play audio track
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  useEffect(() => {
    let isJoined = false;
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, channelName, TOKEN, null)
      .then((uid) => {
        isJoined = true;
        return Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid]);
      })
      .then(([tracks, uid]) => {
        setLocalTracks(tracks);
        const [audioTrack, videoTrack] = tracks;
        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);
        return client.publish(tracks);
      })
      .catch((error) => {
        console.error("Failed to join Agora channel:", error);
      });

    const durationInMilliseconds = duration * 60000;

    const timer = setTimeout(() => {
      setSessionTimeout(true);
    }, durationInMilliseconds);

    return () => {
      clearTimeout(timer);
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      if (isJoined) {
        client.leave();
        handleLeaveSession();
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
        handleLeaveSession();
        handleEndSession();
      });
    }
  }, [sessionTimeout]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Main video covering the full screen */}
      {users.length > 0 && (
        <VideoPlayer key={users[0].uid} user={users[0]} isMain={true} />
      )}
      {/* Container for small video(s) fixed in the right bottom corner */}
      <div
        style={{
          position: "absolute",
          right: 20, // Distance from the right edge of the screen
          bottom: 20, // Distance from the bottom edge of the screen
          width: "200px", // Fixed width for the small video
          height: "200px", // Fixed height for the small video
        }}
      >
        {users.slice(1).map((user) => (
          <VideoPlayer key={user.uid} user={user} isMain={false} />
        ))}
      </div>
    </div>
  );
};
import React, { useEffect, useRef } from "react";

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <video
        ref={ref}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        autoPlay
        playsInline
        controls={false}
      ></video>
    </div>
  );
};
