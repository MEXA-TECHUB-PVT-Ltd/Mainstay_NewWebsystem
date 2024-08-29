// ** React Imports
import { useSkin } from "@hooks/useSkin";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

// ** Icons Imports
import { Check, ChevronLeft } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
import { Button, Card, CardText, CardTitle, Col, Row } from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const FirstScreen = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [select, setSelect] = useState();
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const param = searchParams.get("page");

  const baseUrl = param === "login" ? "/login" : "/register";

  const handleSubmit = () => {
    if (select) {
      if (select === 1) {
        navigate(`${baseUrl}?user=coach`);
      } else {
        navigate(`${baseUrl}?user=coachee`);
      }
    } else {
      setError("select user");
    }
  };

  const handleChange = (id) => {
    console.log(id, "===", select);
    if (select === id) {
      setSelect("");
    } else {
      setSelect(id);
    }
  };
  return (
    <div className="auth-wrapper auth-cover">
      <img
        className="img-fluid"
        src={"/img/effect.png"}
        alt="Login Cover"
        style={{ height: "50%", position: "absolute", bottom: "50%" }}
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
              {t("Sign in to your account")}
            </p>
          </CardTitle>
          <CardText
            className=" text-center"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <p
              style={{
                fontSize: "14px",
                fontFamily: "Montserrat",
                color: "#7D7D7D",
                fontWeight: "600",
                display: "flex",
                justifyContent: "center",
                letterSpacing: "1px",
                width: "28%",
              }}
            >
              {t(
                "Empower or embrace growth? Choose your path: Coach to lead or Coachee to learn. Your journey, your role"
              )}
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
            <Col className="px-xl-0 mx-auto" sm="8" md="6" lg="12">
              <>
                <Link
                  className="brand-logo"
                  to="/"
                  onClick={(e) => e.preventDefault()}
                >
                  {/* <h2 className='brand-text text-primary ms-1'>Require Sign</h2> */}
                </Link>

                {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}

                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Card
                      onClick={() => handleChange(2)}
                      body
                      className="text-center"
                      style={{
                        width: "220px",
                        height: "220px",
                        border: select === 2 ? "1px solid #0F6D6A" : "",
                        cursor: "pointer",
                        alignItems: "center",
                      }}
                    >
                      <CardTitle tag="h5">
                        <img
                          style={{ width: "auto", height: "60px" }}
                          src="/img/coachee.png"
                        />
                      </CardTitle>
                      <CardText
                        style={{
                          color: select === 2 ? "#0F6D6A" : "",
                        }}
                      >
                        Coachee
                      </CardText>
                      <div
                        style={{
                          backgroundColor:
                            select === 2 ? "#0F6D6A" : "#21212166",
                          color: "#ffff",
                          borderRadius: "50%",
                        }}
                      >
                        <Check />
                      </div>
                    </Card>
                    <div style={{ width: "20px" }}></div>
                    <Card
                      body
                      onClick={() => handleChange(1)}
                      className="text-center"
                      style={{
                        width: "220px",
                        height: "220px",
                        border: select === 1 ? "1px solid #0F6D6A" : "",
                        cursor: "pointer",
                        alignItems: "center",
                      }}
                    >
                      <CardTitle tag="h5">
                        <img
                          style={{ width: "auto", height: "60px" }}
                          src="/img/coach.png"
                        />
                      </CardTitle>{" "}
                      <CardText>Coach </CardText>
                      <div
                        style={{
                          backgroundColor:
                            select === 1 ? "#0F6D6A" : "#21212166",
                          color: "#ffff",
                          borderRadius: "50%",
                        }}
                      >
                        <Check style={{ color: "primary" }} />
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="error" style={{ color: "red" }}>
                  {error}
                </div>
                <Button
                  disabled={select ? false : true}
                  color={select ? "primary" : "secondary"}
                  onClick={handleSubmit}
                  style={{ borderRadius: "50px", marginBottom: "10%" }}
                  block
                >
                  {t("Continue")}
                </Button>
              </>
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
    </div>
  );
};

export default FirstScreen;
