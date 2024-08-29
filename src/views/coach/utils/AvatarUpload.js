import React, { useState } from "react";
import { Input, Label } from "reactstrap";
import Avatar from "@components/avatar";

const AvatarUpload = ({ user, onFileChange }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result); // For preview
        onFileChange(file); // Pass file up for API call
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedAvatar(null);
    }
  };

  return (
    <Label for="profileImage" style={{ cursor: "pointer" }}>
      <div className="avatar-upload">
        <Avatar
          img={selectedAvatar || user?.profile_pic}
          imgHeight="100"
          imgWidth="100"
          status={null} // or a valid status, depending on your logic
          edit={true}
        />
        <Input
          type="file"
          name="profileImage"
          id="profileImage"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </Label>
  );
};

export default AvatarUpload;
