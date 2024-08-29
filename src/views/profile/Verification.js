// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

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
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
// import { Formik, ErrorMessage, Form } from 'formik';
import { useState } from "react";
import { post } from "../../urls/api";
import ReactInputVerificationCode from "react-input-verification-code";
import { useTranslation } from "react-i18next";

const Verification = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get("user");
  const [codes, setCodes] = useState("");

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const postData = {
        code: parseInt(codes),
      };

      const apiData = await post(`coachee/coachee-verification/`, postData);

      if (!apiData.success) {
        setError(apiData.message);
        setSubmitting(false);
      } else {
        setSubmitting(false);

        localStorage.setItem("userData", JSON.stringify(apiData.data));

        navigate(`/reset-password?code=${parseInt(codes)}&user=${user}`);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0 justify-content-center">
        <Link
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "40px",
          }}
        >
          <img
            className="img-fluid"
            src={logo}
            alt="Login Cover"
            style={{ width: "150px", height: "auto" }}
          />
        </Link>

        <Col
          className="d-flex align-items-center d-flex justify-content-center auth-bg   "
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto " sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1 text-center">
              Verification{" "}
            </CardTitle>
            <CardText className="mb-2 text-center">
              Verification code has been sent to JohnDoe@gmail.com{" "}
            </CardText>

            <div className="mb-1" style={{ textAlign: "-webkit-center" }}>
              <ReactInputVerificationCode onChange={setCodes} value={codes} />
            </div>

            <div className="error" style={{ color: "red" }}>
              {error}
            </div>
            <div style={{ width: "100%", textAlignLast: "center" }}>
              <Button color="primary" onClick={handleSubmit}>
                {t("Verify")}
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Verification;
