// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

// ** Icons Imports
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
} from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";
import "react-toastify/ReactToastify.min.css";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { authGet, post, put } from "../urls/api";
import { ToastContainer, toast } from "react-toastify";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { clippingParents } from "@popperjs/core";
import banner from "../@core/assets/images/banner/bannerauth.png";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactCountryFlag from "react-country-flag";
import i18next from "i18next";
import { setLanguage } from "../redux/languageSlice";

let FCMToken;

const firebaseConfig = {
  apiKey: "AIzaSyDgSznHpVwobCeRajlNV7Kd3wzzhdx7q50",
  authDomain: "gtcaptionsignals.firebaseapp.com",
  projectId: "gtcaptionsignals",
  storageBucket: "gtcaptionsignals.appspot.com",
  messagingSenderId: "977631800678",
  appId: "1:977631800678:web:b245b2718a0409ea5b6ca7",
  // measurementId: "G-MRGJW3J35C"
};

const app = initializeApp(firebaseConfig);

// Get the Firebase messaging instance
const messaging = getMessaging(app);

const Register = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userState, setUserState] = useState();
  const [coordinates, setCoordinates] = useState({});
  const { lng } = useSelector((state) => state.languageSlice);
  const dispatch = useDispatch();

  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get("user");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error retrieving location", error);
        }
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    console.log("Inside useEffect");
    if (user === null) {
      console.log("Navigating to /select-user");
      navigate("/login");
    }
  }, [user, navigate]);

  const customCSS = `
  .modal-content {
      background-color: red;
      padding: 20px;
  }
`;

  const handleCoachVerify = () => {
    navigate(`/login?user=${user}&register=true`);
    setModalOpen(false);
    // const response = put(`coach/coach-verification/${userState?.id}`).then(
    //   (response) => {
    //     if (response.success) {
    //       console.log("success verification");
    //     } else {
    //       console.log("Error while verification");
    //     }
    //   }
    // );
  };
  const validateForm = (values) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&]).{8,}$/;
    const errors = {};
    if (!values.email) {
      errors.email = t("Email is Required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = t("Password is Required");
    } else if (!passwordRegex.test(values.password)) {
      errors.password =
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character";
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = t("Confirm Password is Required");
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = t("Passwords do not match");
    }
    return errors;
  };

  const changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
    dispatch(setLanguage(lng));
  };

  return (
    <>
      <div className="d-flex w-100 justify-content-end mt-1">
        <UncontrolledDropdown>
          <DropdownToggle
            caret
            color="primary"
            className="d-flex align-items-center border border-1 text-dark"
          >
            <ReactCountryFlag
              countryCode={lng === "en" ? "US" : "DE"}
              svg
              style={{ marginRight: "8px" }}
            />
            {lng === "en" ? "English" : "German"}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => changeLanguage("en")}
              active={lng === "en"}
              className="text-center w-100"
            >
              English
            </DropdownItem>
            <DropdownItem
              onClick={() => changeLanguage("ge")}
              active={lng === "ge"}
              className="text-center w-100"
            >
              German
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <div
        className="auth-wrapper auth-cover"
        style={{ overflow: "hidden", display: "flex", height: "100vh" }}
      >
        <img
          className="img-fluid"
          src={"/img/effect.png"}
          alt="Login Cover"
          style={{
            zIndex: "-100",
            height: "50%",
            position: "absolute",
            bottom: "50%",
            overflow: "hidden",
          }}
        />
        <Link to="/" className="position-absolute top-0 start-0 m-3">
          <ChevronLeft onClick={() => navigate(-1)} />
        </Link>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ flex: 1 }}
        >
          <div
            className="auth-inner w-100 m-0 p-3"
            style={{ maxWidth: "600px", overflow: "hidden" }}
          >
            <Link
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                padding: "0px",
              }}
            >
              <img
                className="img-fluid"
                src={logo}
                alt="Login Cover"
                style={{ width: "150px", height: "auto", marginTop: "5%" }}
              />
            </Link>
            <div className="d-flex flex-column align-items-center w-100 mt-3">
              <div
                className="d-flex flex-column align-items-center justify-content-center auth-bg mt-2"
                style={{
                  paddingTop: "40px",
                  paddingBottom: "45px",
                  borderRadius: "34px",
                  border: "2px solid #f8f8f8",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  maxWidth: "400px",
                }}
              >
                <CardTitle tag="h2" className="fw-bold text-center">
                  <p
                    style={{
                      fontSize: "25px",
                      fontFamily: "Montserrat",
                      color: "#161616",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Sign Up to your account")}
                  </p>
                </CardTitle>
                <CardText className="text-center">
                  <p
                    style={{
                      fontSize: "14px",
                      fontFamily: "Montserrat",
                      color: "#7D7D7D",
                      fontWeight: "600",
                    }}
                  >
                    {t("Already have an account?")}
                    <Link to={`/login?user=${user}`}>{t("Sign in")}</Link>
                  </p>
                </CardText>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }}
                  validate={validateForm}
                  onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    try {
                      const postData = {
                        email: values.email,
                        password: values.password,
                        role: user,
                        device_id: "currentToken",
                        lat: coordinates?.lat,
                        long: coordinates.long,
                      };

                      const apiData = await post(`auth/register`, postData);

                      if (!apiData.success) {
                        setError(apiData.message);
                        setSubmitting(false);
                      } else {
                        setSubmitting(false);
                        localStorage.setItem(
                          "loginUserData",
                          JSON.stringify(apiData.result)
                        );
                        if (user === "coachee") {
                          window.location.href = `/coachee-verification?user=${user}&email=${values.email}&sign_up=true`;
                        } else {
                          setUserState(apiData.result);
                          setError("");
                          setModalOpen(true);
                        }
                      }
                    } catch (err) {
                      console.log("An error occurred:", err);
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <>
                      <Link
                        className="brand-logo"
                        to="/"
                        onClick={(e) => e.preventDefault()}
                      ></Link>
                      <Form
                        className="auth-login-form mt-2"
                        style={{ width: "100%", padding: "0 50px" }}
                      >
                        <div className="mb-2">
                          <InputGroup>
                            <InputGroupText
                              style={{
                                borderBottomLeftRadius: "25%",
                                borderTopLeftRadius: "25%",
                                borderRight: "none",
                                backgroundColor: "#EEEEEE",
                              }}
                            >
                              <Mail size={14} />
                            </InputGroupText>
                            <Field
                              style={{
                                paddingLeft: "0px",
                                borderLeft: "none",
                                borderRight: "none",
                                backgroundColor: "#EEEEEE",
                                WebkitBoxShadow: "#EEEEEE",
                              }}
                              name="email"
                              id="login-email"
                              placeholder="Email"
                              as={Input}
                              type="email"
                            />
                            <InputGroupText
                              style={{
                                borderBottomRightRadius: "25%",
                                borderTopRightRadius: "25%",
                                borderLeft: "none",
                                backgroundColor: "#EEEEEE",
                              }}
                            ></InputGroupText>
                          </InputGroup>
                          <ErrorMessage name="email">
                            {(msg) => (
                              <div className="error" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="mb-2">
                          <InputGroup>
                            <InputGroupText
                              style={{
                                borderRight: "none",
                                backgroundColor: "#EEEEEE",
                                borderBottomLeftRadius: "25%",
                                borderTopLeftRadius: "25%",
                              }}
                            >
                              <Lock size={14} />
                            </InputGroupText>
                            <Field
                              style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                                borderLeft: "none",
                                borderRight: "none",
                                backgroundColor: "#EEEEEE",
                              }}
                              autoComplete="off"
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Password"
                              as={Input}
                              className="input-group-merge"
                              id="login-password"
                            />
                            <InputGroupText
                              onClick={() => setShowPassword(!showPassword)}
                              style={{
                                cursor: "pointer",
                                borderLeft: "none",
                                backgroundColor: "#EEEEEE",
                                borderBottomRightRadius: "25%",
                                borderTopRightRadius: "25%",
                              }}
                            >
                              {showPassword ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </InputGroupText>
                          </InputGroup>
                          <ErrorMessage name="password">
                            {(msg) => (
                              <div className="error" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="mb-2">
                          <InputGroup>
                            <InputGroupText
                              style={{
                                borderRight: "none",
                                backgroundColor: "#EEEEEE",
                                borderBottomLeftRadius: "25%",
                                borderTopLeftRadius: "25%",
                              }}
                            >
                              <Lock size={14} />
                            </InputGroupText>
                            <Field
                              name="confirmPassword"
                              autoComplete="off"
                              placeholder="Confirm Password"
                              type={showConfirmPassword ? "text" : "password"}
                              as={Input}
                              className="input-group-merge"
                              id="login-confirmPassword"
                              style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                                borderLeft: "none",
                                borderRight: "none",
                                backgroundColor: "#EEEEEE",
                              }}
                            />
                            <InputGroupText
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              style={{
                                cursor: "pointer",
                                borderLeft: "none",
                                backgroundColor: "#EEEEEE",
                                borderBottomRightRadius: "25%",
                                borderTopRightRadius: "25%",
                              }}
                            >
                              {showConfirmPassword ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </InputGroupText>
                          </InputGroup>
                          <ErrorMessage name="confirmPassword">
                            {(msg) => (
                              <div className="error" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div className="error" style={{ color: "red" }}>
                          {error}
                        </div>
                        <Button
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                          block
                          style={{ borderRadius: "50px", marginTop: "10%" }}
                        >
                          {isSubmitting ? (
                            <Spinner size="sm"></Spinner>
                          ) : (
                            t("Sign Up")
                          )}
                        </Button>
                      </Form>
                    </>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          className="d-none d-lg-flex align-items-center justify-content-center"
          style={{ flex: 1 }}
        >
          <img
            className="img-fluid"
            src={banner}
            alt="Banner"
            style={{
              height: "auto",
              width: "90%",
              position: "relative",
              zIndex: "-100",
            }}
          />
        </div> */}
      </div>
      <Modal
        style={{ marginTop: "15%" }}
        isOpen={modalOpen}
        toggle={toggleModal}
      >
        <ModalHeader toggle={toggleModal}>Alert</ModalHeader>
        <ModalBody>
          Your sign up request is being reviewed by the admin.
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button
            color="primary"
            className="justify-content-center w-75"
            style={{ borderRadius: "35px" }}
            onClick={handleCoachVerify}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Register;
