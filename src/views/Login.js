// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useLocation, useNavigate } from "react-router-dom";

// ** Icons Imports
import {
  Facebook,
  Twitter,
  Mail,
  Eye,
  EyeOff,
  Lock,
  ChevronLeft,
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
  Spinner,
  FormGroup,
  ButtonGroup,
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// import CryptoJS from "crypto-js";

import banner from "../@core/assets/images/banner/bannerauth.png";

import sha256 from "sha.js/sha256";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { authGet, authPost, post, put } from "../urls/api";
import { clippingParents } from "@popperjs/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/languageSlice";

const Login = () => {
  const { t, i18n } = useTranslation();
  const { skin } = useSkin();
  const { lng } = useSelector((state) => state.languageSlice);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [initialPassword, setInitialPassword] = useState("");

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const param = searchParams.get("user");
  const register = searchParams.get("register");

  console.log(param);
  // If user is null, render a Redirect component
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hashPassword = (password) => {
    return new sha256().update(password).digest("hex");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    dispatch(setLanguage(lng));
  };

  // const getCurrentLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         return {
  //           lat: position.coords.latitude,
  //           long: position.coords.longitude,
  //         };
  //       },
  //       (error) => {
  //         console.error("Error retrieving location", error);
  //       }
  //     );
  //   }
  // };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPasswordEncrypted = localStorage.getItem(
      "rememberedPasswordEncrypted"
    );
    if (rememberedEmail && rememberedPasswordEncrypted) {
      setRememberMe(true);
      setInitialEmail(rememberedEmail);
      setInitialPassword(decipher(salt)(rememberedPasswordEncrypted));
    }
  }, []);
  const salt = "mySecretSalt";

  const cipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) =>
      text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
  };

  const decipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return (encoded) =>
      encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const updateCompleted = async (token) => {
    const status = await put(
      "coach/update",
      { is_stripe_completed: true },
      token
    );
  };

  const checkStripeStatus = async (accountId, token) => {
    // Check if accountId is provided
    if (!accountId) {
      console.log(
        "No Stripe account accountId provided, creating account link..."
      );
      const accountCreatedResult = await authPost(
        "payments/create-account-link",
        {},
        token
      );
      if (accountCreatedResult?.result?.url) {
        window.location.href = accountCreatedResult.result.url;
        return; // Exit the function to prevent further execution
      } else {
        console.error("Failed to create Stripe account link.");
        return;
      }
    }

    if (accountId) {
      // If accountId is available, check the verification status
      const status = await authGet(
        `payments/check-verification-status?accountId=${accountId}`
      );
      if (status && status.result && Object.keys(status.result).length > 0) {
        const hasNonNullData = Object.values(status.result).some(
          (value) => value !== null && value.length > 0
        );

        if (
          status.result.current_deadline !== null ||
          status.result.disabled_reason !== null ||
          status.result.currently_due.length > 0 ||
          status.result.past_due.length > 0 ||
          status.result.pending_verification.length > 0 ||
          status.result.errors.length > 0
        ) {
          console.log("We need requirements data and have the account Id");
          // Redirect to Stripe for further verification
          const accountCreatedResult = await authPost(
            "payments/create-account-link"
          );
          if (accountCreatedResult?.result?.url) {
            window.location.href = accountCreatedResult.result.url;
          }
        } else {
          // Call updateCompleted only when Stripe requirements are fully met
          console.log("We have  data and have the account Id");
          window.location.href = "/coach/home";
          updateCompleted();
        }
      } else {
        // If no data to process, mark verification as completed
        console.log("We have  data and have the account Id");
        window.location.href = "/coach/home";
        updateCompleted();
      }
    }
  };
  return (
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
                paddingTop: "55px",
                borderRadius: "34px",
                border: "2px solid #f8f8f8",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                width: "100%",
              }}
            >
              <div className="d-flex mb-2">
                <ButtonGroup>
                  <Button
                    onClick={() => changeLanguage("en")}
                    color={`${lng === "en" ? "primary" : "secondary"}`}
                  >
                    English
                  </Button>
                  <Button
                    onClick={() => changeLanguage("ge")}
                    color={`${lng === "ge" ? "primary" : "secondary"}`}
                  >
                    German
                  </Button>
                </ButtonGroup>
              </div>
              <CardTitle tag="h2" className="fw-bold text-center">
                <p
                  style={{
                    fontSize: "25px",
                    fontFamily: "Montserrat",
                    color: "#161616",
                    fontWeight: "bold",
                  }}
                >
                  {t("Sign in to your account")}
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
                  {t("Don’t have an account?")}
                  <Link to={`/select-user`}> {t("Sign Up")} </Link>
                </p>
              </CardText>
              <Formik
                initialValues={{
                  email: initialEmail,
                  password: initialPassword,
                }}
                enableReinitialize
                validate={(values) => {
                  const errors = {};
                  if (!values.email) {
                    errors.email = t("Email is Required");
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = t("Invalid email address");
                  }
                  if (!values.password) {
                    errors.password = t("Password is Required");
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  setLoading(true);
                  try {
                    const postData = {
                      email: values.email,
                      password: values.password,
                    };

                    const response = await post(`auth/sign-in`, postData);

                    if (!response.success) {
                      setError(response.message);
                    } else {
                      localStorage.setItem(
                        "loginUserData",
                        JSON.stringify(response.result)
                      );

                      if (rememberMe) {
                        localStorage.setItem("rememberedEmail", values.email);
                        const passwordEncrypted = cipher(salt)(values.password);
                        localStorage.setItem(
                          "rememberedPasswordEncrypted",
                          passwordEncrypted
                        );
                      } else {
                        localStorage.removeItem("rememberedEmail");
                        localStorage.removeItem("rememberedPasswordEncrypted");
                      }

                      const user = response.result.user;
                      const role = user.role;

                      switch (role) {
                        case "coach":
                          if (
                            register === "true" ||
                            !user?.coach?.is_completed
                          ) {
                            window.location.href = `/profile`;
                          }

                          if (!user?.coach?.is_stripe_completed) {
                            if (user.coach.stripe_account_id) {
                              checkStripeStatus(
                                user.coach.stripe_account_id,
                                response.result?.accessToken
                              );
                            } else {
                              setLoading(true);
                              const accountCreatedResult = await authPost(
                                "payments/create-account-link",
                                {},
                                response.result?.accessToken
                              );
                              if (accountCreatedResult?.result?.url) {
                                window.location.href =
                                  accountCreatedResult.result.url;
                              }
                            }
                          } else {
                            window.location.href = "/coach/home";
                          }
                          break;

                        case "coachee":
                          setLoading(false);
                          window.location = "/coachee/home";
                          break;

                        default:
                          setLoading(false);
                      }
                    }
                  } catch (error) {
                    setLoading(false);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form
                    className="auth-login-form"
                    style={{ width: "100%", padding: "0 100px" }}
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
                          }}
                          name="email"
                          id="login-email"
                          placeholder="john@example.com"
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
                            borderBottomLeftRadius: "25%",
                            borderTopLeftRadius: "25%",
                            borderRight: "none",
                            backgroundColor: "#EEEEEE",
                          }}
                        >
                          <Lock size={14} />
                        </InputGroupText>
                        <Field
                          as={Input}
                          style={{
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            borderLeft: "none",
                            borderRight: "none",
                            backgroundColor: "#EEEEEE",
                          }}
                          type={showPassword ? "text" : "password"}
                          autoComplete="off"
                          name="password"
                          id="login-password"
                          placeholder="Password"
                          className="input-group-merge"
                        />
                        <InputGroupText
                          onClick={togglePasswordVisibility}
                          style={{
                            borderBottomRightRadius: "25%",
                            borderTopRightRadius: "25%",
                            cursor: "pointer",
                            borderLeft: "none",
                            backgroundColor: "#EEEEEE",
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
                    <FormGroup
                      check
                      className="mb-1 ms-0 ml-0"
                      style={{ textAlign: "right" }}
                    >
                      <Label check>
                        <Field
                          type="checkbox"
                          name="rememberMe"
                          checked={rememberMe}
                          onChange={handleRememberMeChange}
                        />{" "}
                        {t("Remember Me")}
                      </Label>
                    </FormGroup>
                    <div className="error" style={{ color: "red" }}>
                      {error}
                    </div>
                    <Button
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                      block
                      className="w-50"
                      style={{
                        borderRadius: "50px",
                        boxShadow: "none",
                        marginTop: "14%",
                      }}
                    >
                      {loading ? (
                        <Spinner size="sm">Loading...</Spinner>
                      ) : (
                        t("Sign in")
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
              <div className="divider my-2">
                <Link to={`/forgot-password`}>
                  <small style={{ fontWeight: "600" }}>
                    {" "}
                    {t("Forget Password?")}{" "}
                  </small>
                </Link>
              </div>
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
  );
};

export default Login;
