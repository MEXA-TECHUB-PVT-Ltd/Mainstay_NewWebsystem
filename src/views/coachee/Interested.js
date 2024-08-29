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
import { get, put } from "../../urls/api";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Interested = () => {
  const { t } = useTranslation();
  const { lng } = useSelector((state) => state.languageSlice);
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const [coachingArea, setCoachingArea] = useState([]);
  const [selectedCoachingArea, setSelectedCoachingArea] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (coaching_area_id) => {
    if (selectedCoachingArea.includes(coaching_area_id)) {
      setSelectedCoachingArea(
        selectedCoachingArea.filter((id) => id !== coaching_area_id)
      );
    } else {
      setSelectedCoachingArea([...selectedCoachingArea, coaching_area_id]);
    }
  };

  const filterCoachingArea = () => {
    return coachingArea?.filter((item) =>
      item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    setLoading(true);
    get("coach-area/get-all").then((res) => {
      console.log(res);
      setCoachingArea(res.result);
      setLoading(false);
    });
  }, []);
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  return (
    <div className="auth-wrapper auth-cover">
      <img
        className="img-fluid"
        src={"/img/effect.png"}
        alt="Login Cover"
        disabled
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
        <Row
          className="d-flex justify-content-center"
          style={{ width: "100%", padding: "10px", marginTop: "3%" }}
        >
          <CardTitle
            tag="h2"
            className="fw-bold m-3 text-center"
            style={{ color: "#161616", fontSize: "25px", fontWeight: "700" }}
          >
            {t("Which areas are you interested in?")}
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
              <Formik
                initialValues={{ coaching_area_ids: [] }}
                validate={(values) => {
                  const errors = {};
                  if (selectedCoachingArea.langth === 0) {
                    errors.first_name = "coaching area required";
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log(selectedCoachingArea);

                  if (selectedCoachingArea.length === 0) {
                    setError("select at least one");
                    return 0;
                  }

                  try {
                    const postData = {
                      interests: selectedCoachingArea,
                      role: "coachee",
                    };
                    const apiData = await put("users/updateProfile", postData); // Specify the endpoint you want to call
                    if (!apiData.success) {
                      setError(apiData.message);
                      setSubmitting(false);
                    } else {
                      console.log(apiData.result);
                      setSubmitting(false);

                      navigate("/coachee-profile-complete");

                      //  open page dashboard/analytics
                    }
                  } catch (error) {
                    console.log(error);

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
                    >
                      {/* <h2 className='brand-text text-primary ms-1'>Require Sign</h2> */}
                    </Link>

                    {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}
                    <Form
                      className="auth-login-form mt-2 "
                      style={{ minHeight: "500px", textAlignLast: "center" }}
                    >
                      {loading && <Spinner />}
                      <div className="mb-1 ">
                        {filterCoachingArea()?.map((item) => (
                          <div
                            key={item.id}
                            className="d-flex justify-content-between mt-2"
                            style={{
                              backgroundColor: "#EEEEEE",
                              padding: "10px",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleCheckboxChange(item.id)}
                          >
                            <Label
                              className="form-check-label"
                              // for='remember-me'
                              disabled
                            >
                              {item.icon && (
                                <img
                                  src={item.icon}
                                  alt="Language Icon"
                                  className="me-2"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                              )}
                              {lng === "ge" ? item.german_name : item.name}
                            </Label>
                            <Input
                              value={item.id}
                              checked={selectedCoachingArea.includes(item.id)}
                              type="checkbox"
                              id="remember-me"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="error" style={{ color: "red" }}>
                        {error}
                      </div>
                      <Button
                        style={{ borderRadius: "35px" }}
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        block
                      >
                        {isSubmitting ? (
                          <Spinner size="sm"> {t("Loading...")} </Spinner>
                        ) : (
                          t("Create")
                        )}{" "}
                      </Button>
                    </Form>
                  </>
                )}
              </Formik>
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
          }}
        />
      </Col>
    </div>
  );
};

export default Interested;
