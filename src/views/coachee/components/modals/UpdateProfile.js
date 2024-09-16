import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Input,
  FormGroup,
  Spinner,
  ModalHeader,
} from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-number-input";
import { Camera } from "react-feather";

// Custom imports
import InputPasswordToggle from "@components/input-password-toggle";
import Avatar from "@components/avatar";
import SelectField from "../../../../utility/SelectField";
import { useSkin } from "@hooks/useSkin";
import { get, imgPut, put } from "../../../../urls/api";

// Assets
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { toast } from "react-toastify";
import AvatarUpload from "../../../coach/utils/AvatarUpload";
import { updateProfileImage } from "../../../coach/services/api";

import moment from "moment";
import { useTranslation } from "react-i18next";

const UpdateProfile = ({ isModalOpen, toggleModal, user, refetch }) => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [options, setOptions] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const [profileImage, setProfileImage] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const illustration = skin === "dark" ? illustrationsDark : illustrationsLight;

  useEffect(() => {
    get("country/get-all").then((res) => {
      setOptions(res.country);
    });
  }, []);

  // Validation schema
  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string().required(t("First name is required")),
    last_name: Yup.string().required(t("Last name is required")),
    phone: Yup.string().required(t("Phone is required")),
    date_of_birth: Yup.date()
      .nullable()
      .required(t("Date of Birth is required"))
      .min(new Date(1900, 0, 1), t("Date of birth is too early"))
      .max(new Date(), t("Date of birth cannot be in the future"))
      .test("age", t("You must be at least 18 years old"), (value) => {
        return moment().diff(moment(value), "years") >= 18;
      }),
  });

  const handleFileChange = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile_pic", file);
      formData.append("role", "coachee");
      await updateProfileImage(formData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("An error occurred while uploading the file.");
    }
  };

  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        <h4 style={{ fontWeight: "bold", color: "#0F6D6A" }}>
          {t("Update Profile")}
        </h4>
      </ModalHeader>
      <div className="px-4 py-2">
        <Formik
          initialValues={{
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            phone: user?.phone || "",
            date_of_birth: user?.date_of_birth || "",
            country_id: user?.country_id || "",
          }}
          validationSchema={ProfileSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            if (values.date_of_birth === "") {
              delete values.date_of_birth;
            }
            const data = {
              country_id: values.country_id.id,
              first_name: values.first_name,
              last_name: values.last_name,
              role: "coachee",
            };
            if (values.date_of_birth) {
              data["date_of_birth"] = values.date_of_birth;
            }
            if (values.phone) {
              data["phone"] = values.phone;
            }
            put("users/updateProfile", data)
              .then((data) => {
                if (data.success) {
                  toggleModal();
                  refetch();
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
                  }, 2000);
                } else {
                  alert(data.message);
                }
              })
              .catch((error) => console.error(error))
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <FormGroup className="text-center">
                <AvatarUpload user={user} onFileChange={handleFileChange} />
              </FormGroup>

              <Field
                name="first_name"
                as={Input}
                placeholder="First Name"
                className="mb-1"
              />
              <ErrorMessage
                name="first_name"
                component="div"
                className="text-danger"
              />

              <Field
                name="last_name"
                as={Input}
                placeholder="Last Name"
                className="mb-1"
              />
              <ErrorMessage
                name="last_name"
                component="div"
                className="text-danger"
              />

              <Field
                name="date_of_birth"
                type="date"
                as={Input}
                placeholder="Date of Birth"
                className="mb-1"
              />
              <ErrorMessage
                name="date_of_birth"
                component="div"
                className="text-danger"
              />

              <div className="my-2">
                <PhoneInput
                  value={user?.phone || ""}
                  onChange={(phone) => setFieldValue("phone", phone)}
                  international
                  numberInputProps={{
                    inputMode: "numeric",
                    autoComplete: "tel",
                    maxLength: "15",
                    style: {
                      backgroundColor: "#EEEEEE",
                      borderRadius: "8px",
                      width: "100%",
                      height: "calc(1.5em +.75rem + 1px)",
                      padding: "9px",
                      border: ".5px solid #ccc",
                      outline: "none",
                    },
                  }}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-danger"
                />
              </div>

              <Field
                name="country_id"
                as={SelectField}
                options={options}
                placeholder="Country"
                className="mb-1"
              />

              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                block
                style={{ borderRadius: "35px", marginTop: "30px" }}
              >
                {isSubmitting ? <Spinner size="sm" /> : t("Update")}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default UpdateProfile;
