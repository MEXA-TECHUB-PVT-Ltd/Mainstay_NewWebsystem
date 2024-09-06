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
  Input,
  Button,
  InputGroup,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

import banner from "../../@core/assets/images/banner/bannerauth.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
// import { Formik, ErrorMessage, Form } from 'formik';
import { useEffect, useState } from "react";
import ReactInputVerificationCode from "react-input-verification-code";
import { authPost, post } from "../../urls/api";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import ReactCountryFlag from "react-country-flag";
import { setLanguage } from "../../redux/languageSlice";

const CoacheeVerification = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const role = searchParams.get("user");
  const email = searchParams.get("email");
  const signUp = searchParams.get("sign_up");
  const { lng } = useSelector((state) => state.languageSlice);
  const dispatch = useDispatch();

  console.log(signUp, signUp === "true", role === "coachee");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const postData = {
        code: codes,
        email: email,
        // role: role,
      };

      console.log(postData);

      const apiData = await authPost(`auth/code-verification`, postData);

      if (!apiData.success) {
        setLoading(false);
        setError(apiData.message);
      } else {
        notification("Email verified successfully", "success");
        setLoading(false);
        if (signUp === "true" && role === "coachee") {
          navigate(`/coachee-profile`);
        } else {
          navigate(`/reset-password?email=${email}&role=${role}`);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during API call:", error);
    }
  };
  const notification = (text, type) => {
    // toast(text, {
    //   type,
    // });
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
            <Link to="/login" className="position-absolute top-0 start-0 m-3">
              <ChevronLeft />
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
                    {t("Verification")}
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
                    {t("Verification code has been sent to Your Email")}
                  </p>
                </CardText>
                <div
                  className="mb-1 d-flex flex-col align-items-center justify-content-center"
                  style={{
                    textAlign: "center",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div style={{ width: "100%", maxWidth: "320px" }}>
                    <ReactInputVerificationCode
                      onChange={setCodes}
                      value={codes}
                    />
                  </div>
                  <div className="error" style={{ color: "red" }}>
                    {error}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center mt-2"
                    style={{ width: "100%", maxWidth: "320px" }}
                  >
                    <Button
                      style={{
                        borderRadius: "35px",
                        marginBottom: "10%",
                        width: "100%",
                      }}
                      color="primary"
                      onClick={handleSubmit}
                      type="submit"
                      disabled={loading}
                      block
                    >
                      {loading ? <Spinner size="sm"></Spinner> : t("Verify")}
                    </Button>
                  </div>
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
    </>
  );
};

export default CoacheeVerification;
