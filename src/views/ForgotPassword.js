// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useLocation, useNavigate } from "react-router-dom";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub, ChevronLeft } from "react-feather";

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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

import banner from "../@core/assets/images/banner/bannerauth.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { post } from "../urls/api";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../redux/languageSlice";
import i18next from "i18next";
// import { post, put } from '../urls/api';

const ForgetPassword = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  const { lng } = useSelector((state) => state.languageSlice);
  const dispatch = useDispatch();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const email = searchParams.get("email");
  const role = searchParams.get("role");

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
        style={{
          overflow: "hidden",
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
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
            left: "0%",
            overflow: "hidden",
          }}
        />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ flex: 1 }}
        >
          <div
            className="auth-inner w-100 m-0 p-3"
            style={{ maxWidth: "600px", overflow: "hidden" }}
          >
            <Link to="/" className="position-absolute top-0 start-0 m-3">
              <ChevronLeft onClick={() => navigate(-1)} />
            </Link>
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
                <CardTitle tag="h2" className="fw-bold text-center">
                  <p
                    style={{
                      fontSize: "25px",
                      fontFamily: "Montserrat",
                      color: "#161616",
                      fontWeight: "bold",
                    }}
                  >
                    {t("Forget Password")}
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
                    {t("Enter your email address for verification code")}
                  </p>
                </CardText>
                <Formik
                  initialValues={{ email: "" }}
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
                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const postData = { email: values.email };
                      const apiData = await post(
                        `auth/forget-password/`,
                        postData
                      );
                      if (!apiData.success) {
                        setError(apiData.message);
                        setSubmitting(false);
                      } else {
                        setSubmitting(false);
                        navigate(`/coachee-Verification?email=${values.email}`);
                      }
                    } catch (error) {
                      setSubmitting(false);
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
                              backgroundColor: "#EEEEEE",
                              borderRight: "none",
                              borderBottomLeftRadius: "25%",
                              borderTopLeftRadius: "25%",
                            }}
                          >
                            <Mail size={14} />
                          </InputGroupText>
                          <Field
                            name="email"
                            id="login-email"
                            placeholder="john@example.com"
                            as={Input}
                            type="email"
                            style={{
                              paddingLeft: "0px",
                              borderLeft: "none",
                              borderRight: "none",
                              backgroundColor: "#EEEEEE",
                            }}
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
                      <div className="error" style={{ color: "red" }}>
                        {error}
                      </div>
                      <Button
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        style={{ borderRadius: "25px", marginBottom: "30px" }}
                        block
                      >
                        {isSubmitting ? (
                          <Spinner size="sm"> {t("Loading...")} </Spinner>
                        ) : (
                          t("Send Code")
                        )}
                      </Button>
                    </Form>
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
            zIndex: "-100",
          }}
        />
      </div> */}
      </div>
    </>
  );
};

export default ForgetPassword;
