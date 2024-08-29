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
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
// import { Formik, ErrorMessage, Form } from 'formik';
import { useEffect, useState } from "react";
import { post } from "../../urls/api";
import { ToastContainer, toast } from "react-toastify";

import ReactInputVerificationCode from "react-input-verification-code";
import { useTranslation } from "react-i18next";

const VerificationCode = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const email = searchParams.get("email");
  const role = searchParams.get("role");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const postData = {
        email,
        code: codes,
        // role,
      };

      const apiData = await post(`auth/code-verification/`, postData);

      if (!apiData.success) {
        setLoading(false);

        setError(apiData.message);
      } else {
        setLoading(false);
        navigate(`/reset-password?email=${email}&role=${role}`);
      }
    } catch (error) {
      setLoading(false);

      console.error("Error during API call:", error);
    }
  };
  const reSendEmail = async () => {
    if (!loading) {
      setLoading(true);
      post(`auth/forget-password/`, {
        email,
        // role,
      }).then((res) => {
        setLoading(false);
        if (res.success) {
          toast("New Code To Your Email", {
            type: "success",
          });
        } else {
          toast(res.message, {
            type: "fail",
          });
        }
      });
    }
  };
  return (
    <div className="auth-wrapper auth-cover">
      <img
        className="img-fluid"
        src={"/img/effect.png"}
        alt="Login Cover"
        style={{
          zIndex: "-100",
          height: "50%",
          position: "absolute",
          bottom: "50%",
        }}
      />

      <Link to="/" className="position-absolute top-0 start-0 m-3">
        <ChevronLeft onClick={() => navigate(-1)} />
      </Link>

      <Col className="auth-inner m-0 justify-content-center">
        <Link
          // to='/'
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
        <Col
          style={{ width: "100%", padding: "10px", marginTop: "2%" }}
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
              {t("Verification")}
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
              {t("Verification code has been sent to Your Email")}
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
              {" "}
              <div className="mb-1" style={{ textAlign: "-webkit-center" }}>
                <ReactInputVerificationCode onChange={setCodes} value={codes} />
                {/* <p disable={true} className="p-1">
                  <spn
                    style={{
                      color: "#0F6D6A",
                      fontWeight: "600",
                      cursor: loading ? "default" : "pointer",
                    }}
                    onClick={reSendEmail}
                  >
                    Resend Code
                  </spn>{" "}
                  in 00:57
                </p> */}
              </div>
              <div className="error" style={{ color: "red" }}>
                {error}
              </div>
              <div style={{ width: "100%", textAlignLast: "center" }}>
                <Button
                  style={{ borderRadius: "35px", marginBottom: "10%" }}
                  color="primary"
                  type="submit"
                  disabled={loading}
                  block
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <Spinner size="sm"></Spinner>
                  ) : (
                    t("Code Verification")
                  )}
                </Button>
              </div>
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
            height: "50%",
            position: "absolute",
            top: "50%",
            left: "80% ",
            userSelect: "none",
          }}
        />
      </Col>
      {/* <ToastContainer position="top-center" newestOnTop /> */}
    </div>
  );
};

export default VerificationCode;
