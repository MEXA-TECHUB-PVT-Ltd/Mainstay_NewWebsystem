// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, ChevronLeft } from "react-feather";

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  // Form,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupText,
  Spinner,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState } from "react";
import { imgPut, put } from "../../urls/api";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";

import Avatar from "@components/avatar";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const [loading, setLoading] = useState(false);
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];

      // Set selectedAvatar for preview
      if (file) {
        const reader = new FileReader();
        const formData = new FormData();
        formData.append("profile_pic", file);
        formData.append("role", "coach");
        // Log formData to check its content

        const apiData = await imgPut("users/updateProfile", formData); // Specify the endpoint you want to call
        if (apiData) {
          setLoading(false);
        }
        reader.onloadend = () => {
          setSelectedAvatar(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedAvatar(null);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper auth-cover px-2">
      <img
        className="img-fluid"
        src={"/img/effect.png"}
        alt="Login Cover"
        disabled
        style={{
          zIndex: "-100",
          height: "50%",
          position: "absolute",
          bottom: "50%",
        }}
      />
      <Link to="/login" className="position-absolute top-0 start-0 m-3">
        <ChevronLeft onClick={() => navigate(-1)} />
      </Link>
      <Col className="auth-inner m-0 justify-content-center">
        <Col
          style={{ width: "100%", padding: "10px", marginTop: "5%" }}
          className="align-items-center  justify-content-center"
          lg="3"
          sm="12"
        >
          <CardTitle tag="h2" className="fw-bold  text-center">
            <p
              style={{
                fontSize: "25px",
                fontFamily: "Montserrat",
                color: "#161616",
                fontWeight: "bold",
              }}
            >
              {t("Fill your Profile")}
            </p>
          </CardTitle>
          <CardText className=" text-center">
            <p
              style={{
                fontSize: "14px",
                fontFamily: "Montserrat",
                color: "#7D7D7D",
                fontWeight: "600",
              }}
            >
              {t("Don’t worry you can always change it later.")}
            </p>
          </CardText>
        </Col>
        <Row className="d-flex justify-content-center">
          {" "}
          <Col
            className="d-flex align-items-center d-flex justify-content-center auth-bg   "
            lg="3"
            sm="12"
            style={{
              paddingTop: "55px",
              height: "85%",
              borderRadius: "34px",
              border: "2px solid #f8f8f8",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Col className="px-xl-2 mx-auto " sm="8" md="6" lg="12">
              <Formik
                initialValues={{ first_name: "", last_name: "", about: "" }}
                validate={(values) => {
                  const errors = {};
                  if (!values.first_name) {
                    errors.first_name = t("First name is required");
                  }
                  if (!values.last_name) {
                    errors.last_name = t("Last name is required");
                  }
                  if (!values.about) {
                    errors.about = t("Description is required");
                  } else if (values.about.length > 250) {
                    errors.about = t(
                      "Description must be less than 250 characters"
                    );
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log(values);

                  try {
                    const postData = {
                      first_name: values.first_name,
                      last_name: values.last_name,
                      about: values.about,
                      role: "coach",
                    };
                    const apiData = await put("users/updateProfile", postData); // Specify the endpoint you want to call

                    if (!apiData.success) {
                      setError(apiData.message);
                      setSubmitting(false);
                    } else {
                      setSubmitting(false);

                      navigate("/language");

                      //  open page dashboard/analytics
                    }
                  } catch (error) {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, setFieldValue, values }) => (
                  <>
                    <Link
                      className="brand-logo"
                      to="/"
                      onClick={(e) => e.preventDefault()}
                    >
                      {/* <h2 className='brand-text text-primary ms-1'>Require Sign</h2> */}
                    </Link>

                    {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}
                    <Form className="auth-login-form  mb-2">
                      <div className="mb-1 text-center">
                        <Label for="profileImage" style={{ cursor: "pointer" }}>
                          {/* Wrap both file input and avatar inside a label */}
                          <div className="avatar-upload">
                            <Avatar
                              img={
                                loading
                                  ? "/public/icons/spinner.gif"
                                  : selectedAvatar || defaultAvatar
                              }
                              imgHeight="100"
                              imgWidth="100"
                              status=""
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
                        <ErrorMessage name="profileImage">
                          {(msg) => (
                            <div className="error" style={{ color: "red" }}>
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="mb-1 d-flex ">
                        <div>
                          <Field
                            style={{
                              backgroundColor: "#EEEEEE",
                              borderRadius: "8px",
                            }}
                            name="first_name"
                            as={Input}
                            className="input-group-merge"
                            placeholder={t("First Name")}
                            id="first_name"
                          />
                          <ErrorMessage name="first_name">
                            {(msg) => (
                              <div className="error" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div style={{ width: "10px" }}></div>
                        <div>
                          <Field
                            style={{
                              backgroundColor: "#EEEEEE",
                              borderRadius: "8px",
                            }}
                            name="last_name"
                            as={Input}
                            className="input-group-merge"
                            placeholder={t("Last Name")}
                            id="last_name"
                          />
                          <ErrorMessage name="last_name">
                            {(msg) => (
                              <div className="error" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="mb-1">
                        <div className="d-flex justify-content-between"></div>
                        <Field
                          name="about"
                          as="textarea"
                          placeholder={t("Description")}
                          className="input-group-merge"
                          id="about"
                          rows={5}
                          // cols={20}
                          maxLength={250}
                          style={{
                            backgroundColor: "#EEEEEE",
                            borderRadius: "8px",
                            padding: "10px",
                            width: "100%",
                          }}
                          value={values.about}
                          onChange={(e) => {
                            setDescriptionLength(e.target.value.length); // Update character count
                            setFieldValue("about", e.target.value); // Update formik state
                          }}
                        />
                        <div className="character-counter">
                          {descriptionLength}/250
                        </div>
                        <ErrorMessage name="about">
                          {(msg) => (
                            <div className="error" style={{ color: "red" }}>
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                        {/* <ErrorMessage name="password" component={Error} /> */}
                      </div>

                      <div className="error" style={{ color: "red" }}>
                        {error}
                      </div>
                      <Button
                        style={{ borderRadius: "35px", marginTop: "40px" }}
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        block
                      >
                        {isSubmitting ? (
                          <Spinner size="sm"></Spinner>
                        ) : (
                          t("NEXT")
                        )}
                      </Button>
                    </Form>
                  </>
                )}
              </Formik>
            </Col>
          </Col>
        </Row>
        <img
          className="img-fluid"
          src={"/img/effect2.png"}
          alt="Login Cover"
          disabled
          style={{
            zIndex: "-100",
            height: "48%",
            position: "absolute",
            top: "50%",
            left: "80% ",
          }}
        />
      </Col>
    </div>
  );
};

export default Profile;
