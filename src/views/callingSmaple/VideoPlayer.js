import React, { useEffect, useRef } from "react";

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user?.videoTrack?.play(ref.current);
  }, []);
  useEffect(() => {
    if (user?.videoTrack && ref.current) {
      console.log("Attempting to play video track");
      try {
        user.videoTrack.play(ref.current);
        console.log("Video track playback initiated");
      } catch (err) {
        console.error("Error playing video track", err);
      }
    }
  }, [user?.videoTrack]);

  return (
    <video
      ref={ref}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      autoPlay
      playsInline
      controls={false}
    ></video>
  );
};
