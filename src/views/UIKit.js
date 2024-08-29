// import React, { CSSProperties, useState } from "react";
// import AgoraUIKit, { layout } from "agora-react-uikit";
// import "agora-react-uikit/dist/index.css";
// import { APP_ID } from "./utility/Utils";

// const UIKit = ({ channelName }) => {
//   const [videocall, setVideocall] = useState(true);
//   const [isHost, setHost] = useState(true);
//   const [isPinned, setPinned] = useState(false);
//   const [username, setUsername] = useState("");

//   return (
//     <div style={styles.container}>
//       <div style={styles.videoContainer}>
//         {videocall ? (
//           <>
//             <div style={styles.nav}>
//               <p style={styles.btn} onClick={() => setPinned(!isPinned)}>
//                 Change Layout
//               </p>
//             </div>
//             <AgoraUIKit
//               rtcProps={{
//                 appId: APP_ID,
//                 channel: "test",
//                 token: null, // add your token if using app in secured mode
//                 // role: isHost ? "host" : "audience",
//                 layout: isPinned ? layout.pin : layout.grid,
//                 enableScreensharing: true,
//               }}
//               rtmProps={{ username: username || "user", displayUsername: true }}
//               callbacks={{
//                 EndCall: () => setVideocall(false),
//               }}
//             />
//           </>
//         ) : (
//           <div style={styles.nav}>
//             <input
//               style={styles.input}
//               placeholder="nickname"
//               type="text"
//               value={username}
//               onChange={(e) => {
//                 setUsername(e.target.value);
//               }}
//             />
//             <h3 style={styles.btn} onClick={() => setVideocall(true)}>
//               Start Call
//             </h3>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export const styles = {
//   container: {
//     width: "100vw",
//     height: "100vh",
//     display: "flex",
//     flex: 1,
//     backgroundColor: "#007bff22",
//   },
//   heading: { textAlign: "center", marginBottom: 0 },
//   videoContainer: {
//     display: "flex",
//     flexDirection: "column",
//     flex: 1,
//   },
//   nav: { display: "flex", justifyContent: "space-around" },
//   btn: {
//     backgroundColor: "#007bff",
//     cursor: "pointer",
//     borderRadius: 5,
//     padding: "4px 8px",
//     color: "#ffffff",
//     fontSize: 20,
//   },
//   input: { display: "flex", height: 24, alignSelf: "center" },
// };

// export default UIKit;


      


import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Typography, TextField, Box } from "reactstrap";
import React from 'react'

const UIKit = () => {
  return (
    <>
      <Typography
        variant="h6"
        className="poppinsSemiRegularBold"
        style={{ marginTop: "2%" }}
      >
        Enter Card Details
      </Typography>

      <TextField
        label="Email"
        type="email"
        value={EmailAddress}
        disabled
        className="form-control-stripe"
        name="contact-email"
        placeholder="example@mail.com"
        required
        style={{ width: "100%", marginBlock: "3%", borderRadius: "5px" }}
      />
      <fieldset
        className="FormGroup"
        style={{
          marginBlock: "3%",
          border: "1px solid lightGray",
          borderRadius: "5px",
        }}
      >
        <label className="poppinsRegularBold">Card Number</label>
        <div
          className="form-control-stripe"
          style={{
            marginBlock: "2%",
          }}
        >
          <CardNumberElement options={CARD_OPTIONS} />
        </div>
      </fieldset>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <fieldset
          className="FormGroup"
          style={{
            marginBlock: "3%",
            width: "40%",
            border: "1px solid lightGray",
            borderRadius: "5px",
          }}
        >
          <label className="poppinsRegularBold">Card Expiry</label>
          <div
            className="form-control-stripe"
            style={{
              marginBlock: "2%",
            }}
          >
            <CardExpiryElement options={CARD_OPTIONS} />
          </div>
        </fieldset>
        <fieldset
          className="FormGroup"
          style={{
            marginBlock: "3%",
            width: "40%",
            border: "1px solid lightGray",
            borderRadius: "5px",
          }}
        >
          <label className="poppinsRegularBold">Cvc</label>
          <div
            className="form-control-stripe"
            style={{
              marginBlock: "2%",
            }}
          >
            <CardCvcElement options={CARD_OPTIONS} />
          </div>
        </fieldset>
      </Box>
    </>
  );
}
const CARD_OPTIONS = { iconStyle: "solid", style: { base: { width: '100%', iconColor: "#c4f0ff", color: "black", fontWeight: 500, fontSize: "16px", fontSmoothing: "antialiased", ":-webkit-autofill": { color: "black" }, "::placeholder": { color: "lightgray" } }, invalid: { iconColor: "#ffc7ee", color: "black" } } }

export default UIKit
