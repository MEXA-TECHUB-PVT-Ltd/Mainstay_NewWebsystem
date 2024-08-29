// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

// ** Icons Imports
import { Check, ChevronLeft } from "react-feather";

// ** Custom Components

// ** Reactstrap Imports
import {
  Button,
  Card,
  CardText,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState } from "react";
import { put } from "../../urls/api";

const Gender = () => {
  const { skin } = useSkin();
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [select, setSelect] = useState();
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const postData = {
        gender: select,
        // country: values.country,
        role: "coachee",
      };

      const apiData = await put("users/updateProfile", postData); // Specify the endpoint you want to call
      if (!apiData.success) {
        setError(apiData.message);
        setLoading(false);
      } else {
        setLoading(false);

        navigate("/coachee-profile");

        //  open page dashboard/analytics
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleChange = (id) => {
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
              Tell us about yourself{" "}
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
              To give you a better experience and results we need to know your
              gender
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
                  <div className="d-flex justify-content-around">
                    <div
                      onClick={() => handleChange("male")}
                      className="text-center"
                      style={{
                        width: "130px",
                        height: "130px",
                        border: "1px solid",
                        cursor: "pointer",
                        alignItems: "center",
                        borderRadius: "50%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderColor: select === "male" && "#0F6D6A",
                        background: select === "male" ? "#0f6d6a" : "#FFF",
                      }}
                    >
                      <img
                        className="img-fluid"
                        src={"/icons/male.png"}
                        alt="Male"
                        style={{
                          width: "40px",
                          height: "auto",
                          margin: "0 auto",
                          filter:
                            select === "male"
                              ? "brightness(0) invert(1)"
                              : "none",
                        }}
                      />
                      <p style={{ color: select === "male" && "#FFFF" }}>
                        Male
                      </p>
                    </div>
                    <div
                      onClick={() => handleChange("female")}
                      className="text-center"
                      style={{
                        width: "130px",
                        height: "130px",
                        border: "1px solid",
                        cursor: "pointer",
                        alignItems: "center",
                        borderRadius: "50%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderColor: select === "female" && "#0F6D6A",

                        background: select === "female" ? "#0f6d6a" : "#FFFF",
                      }}
                    >
                      <img
                        className="img-fluid"
                        src={"/icons/female.png"}
                        alt="Female"
                        style={{
                          width: "40px",
                          height: "auto",
                          margin: "0 auto",
                          filter:
                            select === "female"
                              ? "brightness(0) invert(1)"
                              : "none",
                        }}
                      />
                      <p style={{ color: select === "female" && "#FFFF" }}>
                        Female
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  disabled={select ? false : true}
                  color={select ? "primary" : "secondary"}
                  onClick={handleSubmit}
                  style={{
                    borderRadius: "50px",
                    marginBottom: "10%",
                    marginTop: "10%",
                  }}
                  block
                >
                  {loading ? <Spinner size="sm">Loading...</Spinner> : "Next"}
                </Button>
              </>
            </Col>
          </Col>
        </Row>
        <img
          className="img-fluid"
          src={"/img/effect2.png"}
          alt="Login Cover"
          style={{
            height: "50%",
            position: "absolute",
            top: "50%",
            left: "80% ",
          }}
        />
      </Col>
    </div>
  );
};

export default Gender;
