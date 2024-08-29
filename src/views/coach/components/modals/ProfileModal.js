import React, { useState } from "react";
import { Modal, ModalHeader } from "reactstrap";
import ProfileForm from "../../utils/ProfileForm";
import { updateProfile, updateProfileImage } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProfileModal = ({ isModalOpen, toggleModal, user, refetch }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleFileChange = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile_pic", file);
      formData.append("role", "coach");
      await updateProfileImage(formData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("An error occurred while uploading the file.");
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const postData = {
        first_name: values.first_name,
        last_name: values.last_name,
        about: values.about,
        role: "coach",
      };
      const apiData = await updateProfile(postData);
      setSubmitting(false);
      if (!apiData.success) {
        setError(apiData.message);
      } else {
        refetch();
        toggleModal();
        toast.success(t("Profile updated"), {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          window.location.reload();
          // navigate("/coach/profile");
        }, 2000);
      }
    } catch (error) {
      setSubmitting(false);
      setError("An error occurred.");
    }
  };

  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        <h4 style={{ fontWeight: "bold", color: "#0F6D6A" }}>
          {" "}
          {t("Update Profile")}{" "}
        </h4>
      </ModalHeader>

      <div className="px-4 py-1">
        <ProfileForm
          user={user}
          onSubmit={handleSubmit}
          onFileChange={handleFileChange}
          error={error}
        />
      </div>
    </Modal>
  );
};

export default ProfileModal;
