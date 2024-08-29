// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import banner from "../../@core/assets/images/banner/bannerauth.png";

// ** Icons Imports
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
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
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { post } from "../../urls/api";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
// import { post, put } from '../urls/api';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const email = searchParams.get("email");
  const role = searchParams.get("role");

  const { skin } = useSkin();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const notification = (text, type) => {
    toast(text, {
      type,
    });

    navigate(`/login?user=${role}`);
  };
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  return (
    <div
      className="auth-wrapper auth-cover"
      style={{ display: "flex", height: "100vh", overflow: "hidden" }}
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
        className="d-lg-flex align-items-center justify-content-center"
        style={{ flex: 1 }}
      >
        <div
          className="d-flex flex-column align-items-center w-100 m-0 p-3"
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
                  {t("Reset Password")}
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
                  {t("Create a strong password")}
                </p>
              </CardText>
              <Formik
                initialValues={{ password: "", confirmPassword: "" }}
                validate={(values) => {
                  const passwordRegex =
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&]).{8,}$/;
                  const errors = {};
                  if (!values.password) {
                    errors.password = t("Password is required");
                  } else if (!passwordRegex.test(values.password)) {
                    errors.password =
                      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character";
                  }
                  if (!values.confirmPassword) {
                    errors.confirmPassword = t("Confirm Password is required");
                  } else if (values.password !== values.confirmPassword) {
                    errors.confirmPassword = t("Passwords do not match");
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const postData = {
                      email,
                      password: values.password,
                    };
                    const apiData = await post(
                      "auth/reset-password/",
                      postData
                    );
                    if (!apiData.success) {
                      setError(apiData.message);
                      setSubmitting(false);
                    } else {
                      setSubmitting(false);
                      notification(t("Password reset successfully"), "success");
                    }
                  } catch (error) {
                    setSubmitting(false);
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
                      className="auth-login-form mt-0"
                      style={{ width: "100%", padding: "0 50px" }}
                    >
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
                            name="password"
                            as={Input}
                            autoComplete="off"
                            className="input-group-merge"
                            id="login-password"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            style={{
                              paddingLeft: "0px",
                              paddingRight: "0px",
                              borderLeft: "none",
                              borderRight: "none",
                              backgroundColor: "#EEEEEE",
                            }}
                          />
                          <InputGroupText
                            onClick={() => setShowPassword(!showPassword)}
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
                            as={Input}
                            autoComplete="off"
                            className="input-group-merge"
                            id="login-confirmPassword"
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
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
                              borderBottomRightRadius: "25%",
                              borderTopRightRadius: "25%",
                              cursor: "pointer",
                              borderLeft: "none",
                              backgroundColor: "#EEEEEE",
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
                        style={{
                          borderRadius: "35px",
                          marginBottom: "10%",
                          zIndex: "1000",
                        }}
                        block
                      >
                        {isSubmitting ? (
                          <Spinner size="sm"></Spinner>
                        ) : (
                          t("Reset Password")
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
  );
};

export default ResetPassword;
