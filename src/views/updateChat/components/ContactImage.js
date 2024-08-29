import React from "react";

function ContactImage({ imageUrl, altText }) {
  return (
    <img
      src={imageUrl || "default-avatar.png"}
      alt={altText}
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        marginRight: "10px",
      }}
    />
  );
}

export default ContactImage;
