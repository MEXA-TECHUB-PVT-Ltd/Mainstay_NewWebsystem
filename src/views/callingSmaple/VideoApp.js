import { useState } from "react";
import { VideoRoom } from "./videoRoom";
import './style.css'


function VideoApp() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="VideoApp">
      <h1>WDJ Virtual Call</h1>

      {!joined && <button onClick={() => setJoined(true)}>Join Room</button>}

      {joined && <VideoRoom />}
    </div>
  );
}

export default VideoApp;
