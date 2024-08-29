// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

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
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState, useEffect } from "react";
import { authPost, get, post, put } from "../../urls/api";
import { useTranslation } from "react-i18next";

const Duration = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const [duration, setDuration] = useState([
    { value: "30", amount: "" },
    { value: "60", amount: "" },
    { value: "90", amount: "" },
  ]);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (languageId) => {
    if (selectedDuration.includes(languageId)) {
      setSelectedDuration(selectedDuration.filter((id) => id !== languageId));
    } else {
      setSelectedDuration([...selectedDuration, languageId]);
    }
  };
  const handleChange = (index, newAmount) => {
    console.log(newAmount);
    const updatedDuration = [...duration];

    // Update the amount property for the specified index
    updatedDuration[index] = {
      ...updatedDuration[index],
      amount: newAmount,
    };

    // Set the updated state
    setDuration(updatedDuration);
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const result = await authPost("duration/create", {
        durationDetails: duration,
      });

      if (result) {
        const accountCreatedResult = await authPost(
          "payments/create-account-link"
        );

        window.location.href = accountCreatedResult?.result?.url;
      }

      // navigate('/stripe-connect');
      // if (result) {
      //   const status = await put('coach/update', { is_completed: true });
      //   if (status) {
      //     setLoading(false);
      //     navigate('/coach-profile-complete');
      //   }
      // }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  return (
    <div className="auth-wrapper auth-cover">
      <img
        className="img-fluid"
        src={"/img/effect.png"}
        alt="Login Cover"
        style={{
          height: "50%",
          position: "absolute",
          bottom: "50%",
          zIndex: "-1",
        }}
      />
      <Link to="/" className="position-absolute top-0 start-0 m-3">
        <ChevronLeft onClick={() => navigate(-1)} />
      </Link>
      <Col className="auth-inner m-0 justify-content-center">
        <Row
          className="d-flex justify-content-center"
          style={{ marginTop: "3%" }}
        >
          <CardTitle
            tag="h2"
            className="fw-bold m-3 text-center"
            style={{ color: "#161616", fontSize: "25px", fontWeight: "700" }}
          >
            {t("Set Your Session Duration")}
          </CardTitle>{" "}
          <Col
            className="d-flex align-items-center d-flex justify-content-center auth-bg   "
            lg="3"
            sm="12"
            style={{
              paddingTop: "20px",
              paddingBottom: "15px",

              height: "85%",
              borderRadius: "34px",
              border: "2px solid #f8f8f8",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Col className="px-xl-2 mx-auto " sm="8" md="6" lg="12">
              <p style={{ fontSize: "12px" }}>
                {t("19% of amount will be mainstays commission fee")}
              </p>

              <>
                <Link
                  className="brand-logo"
                  to="/"
                  onClick={(e) => e.preventDefault()}
                >
                  {/* <h2 className='brand-text text-primary ms-1'>Require Sign</h2> */}
                </Link>

                {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}
                <div className="mb-1 ">
                  {duration &&
                    duration?.map((item, index) => (
                      <div
                        key={index}
                        className=" justify-content-between mt-2"
                      >
                        <div
                          style={{
                            backgroundColor: selectedDuration.includes(
                              item.value
                            )
                              ? "#0F6D6A"
                              : "#EEEEEE",
                            padding: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          key={item.id}
                          className="d-flex justify-content-between mt-2 pb-1"
                          onClick={() => handleCheckboxChange(item.value)}
                        >
                          <Label
                            // for='remember-me'
                            disabled
                            style={{
                              color: selectedDuration.includes(item.value)
                                ? "#EEEEEE"
                                : "#767676",

                              // padding: '10px',
                              // borderRadius: '5px',
                            }}
                          >
                            {item.value + " " + t("minutes")}
                          </Label>
                          <Input
                            value={item.id}
                            onChange={() => handleCheckboxChange(item.value)}
                            checked={selectedDuration.includes(item.value)}
                            type="checkbox"
                            id="remember-me"
                          />
                        </div>
                        {selectedDuration.includes(item.value) && (
                          <Input
                            style={{
                              marginTop: "10px",
                              backgroundColor: "#EEEEEE",
                            }}
                            name="amount"
                            value={item.amount}
                            placeholder={t("Enter Amount (CHF)")}
                            type={"number"}
                            id="remember-me"
                            onChange={(e) =>
                              handleChange(index, e.target.value)
                            }
                          />
                        )}

                        {/* <Input
                        name='time'
                        onChange={()=>handleChange}
                        checked={selectedDuration.includes(item?.value)}
                        type='checkbox'
                        id='remember-me'
                      /> */}
                      </div>
                    ))}
                </div>

                <div className="error" style={{ color: "red" }}>
                  {error}
                </div>
                <Button
                  disabled={loading}
                  color="primary"
                  type="submit"
                  style={{ borderRadius: "35px", marginTop: "30px" }}
                  onClick={handleSubmit}
                  block
                >
                  {loading ? <Spinner size="sm"></Spinner> : t("NEXT")}
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
            zIndex: "-1",
          }}
        />
      </Col>
    </div>
  );
};

export default Duration;
