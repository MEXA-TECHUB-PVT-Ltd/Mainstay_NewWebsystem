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
import Loader from "../../utility/Loader";
import "../css/home.css";
import { useTranslation } from "react-i18next";

const Language = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const [language, setLanguage] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (languageId) => {
    if (selectedLanguages.includes(languageId)) {
      setSelectedLanguages(selectedLanguages.filter((id) => id !== languageId));
    } else {
      setSelectedLanguages([...selectedLanguages, languageId]);
    }
  };

  const filterLanguages = () => {
    return language.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    setLoading(true);
    get("language/get-all/").then((res) => {
      setLanguage(res.languages);
      setLoading(false);
    });
  }, []);
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  return (
    <div className="auth-wrapper auth-cover px-2">
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
          <CardTitle tag="h2" className="fw-bold m-3 text-center">
            {t("Select your Language")}
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
                initialValues={{ language_ids: [] }}
                validate={(values) => {
                  const errors = {};
                  if (selectedLanguages.language === 0) {
                    errors.first_name = "language required";
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log(selectedLanguages);

                  try {
                    const postData = {
                      language_ids: selectedLanguages,
                      is_completed: true,
                      role: "coach",
                    };
                    console.log(postData);
                    const apiData = await put("users/updateProfile", postData); // Specify the endpoint you want to call
                    // const status = await put("coach/update", {
                    //   is_completed: true,
                    // });

                    console.log(apiData);
                    if (!apiData.success) {
                      setError(apiData.message);
                      setSubmitting(false);
                    } else {
                      console.log(apiData.result);
                      setSubmitting(false);

                      navigate("/coaching-area");

                      //  open page dashboard/analytics
                    }
                  } catch (error) {
                    console.log(apiData);

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
                      style={{ textAlign: "-webkit-center" }}
                    >
                      <Input
                        type="text"
                        placeholder={t("Search...")}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                      />

                      <div
                        className="mb-1 "
                        style={{
                          height: "350px",
                          overflow: "scroll",
                          overflowX: "hidden",
                        }}
                      >
                        {loading && <Spinner />}
                        {filterLanguages().length === 0 && !loading && (
                          <p>no result found</p>
                        )}
                        {language &&
                          filterLanguages()?.map((item) => (
                            <div
                              key={item.id}
                              className="d-flex justify-content-between mt-2 hover-bg"
                              onClick={() => handleCheckboxChange(item.id)}
                              style={{
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                backgroundColor: "#FFFF",
                                padding: "10px",
                                borderRadius: "10px",
                              }}
                            >
                              <Label
                                style={{
                                  textAlign: "left",
                                  fontSize: "17px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                }}
                              >
                                {item.name}
                              </Label>
                              <Input
                                value={item.id}
                                onChange={() => handleCheckboxChange(item.id)}
                                checked={selectedLanguages.includes(item.id)}
                                type="checkbox"
                                id="remember-me"
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          ))}
                      </div>
                      <ErrorMessage name="about">
                        {(msg) => (
                          <div className="error" style={{ color: "red" }}>
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                      {/* <ErrorMessage name="password" component={Error} /> */}

                      <div className="error" style={{ color: "red" }}>
                        {error}
                      </div>
                      <Button
                        color="primary"
                        type="submit"
                        disabled={
                          isSubmitting || selectedLanguages.length === 0
                        }
                        style={{
                          borderRadius: "35px",
                          maxWidth: "80%",
                        }}
                        block
                      >
                        {isSubmitting ? (
                          <Spinner size="sm"></Spinner>
                        ) : (
                          t("NEXT")
                        )}
                      </Button>
                    </Form>
                  </>
                )}
              </Formik>
            </Col>
            <style>
              {`
          ::-webkit-scrollbar {
            width: 0;  /* Remove scrollbar space */
          }

          /* Optional: Customize scrollbar appearance */
          ::-webkit-scrollbar-thumb {
            background-color: transparent;  /* Make thumb transparent */
          }

          ::-webkit-scrollbar-track {
            background-color: transparent;  /* Make track transparent */
          }
        `}
            </style>
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

export default Language;
