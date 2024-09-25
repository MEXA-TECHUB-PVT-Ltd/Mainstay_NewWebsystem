// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Custom Components
import Avatar from "@components/avatar";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import moment from "moment";
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Label,
  Input,
  Button,
  InputGroup,
  Spinner,
} from "reactstrap";
import PhoneInput from "react-phone-number-input";

import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { get, imgPut, put } from "../../urls/api";
import SelectField from "../../utility/SelectField";
import { useTranslation } from "react-i18next";
import { Outline } from "react-pdf";

const Profile = () => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [options, setOptions] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];

      // Set selectedAvatar for preview
      if (file) {
        setLoading(true);
        const reader = new FileReader();
        const formData = new FormData();
        formData.append("profile_pic", file);
        formData.append("role", "coachee");
        // Log formData to check its content

        const apiData = await imgPut("users/updateProfile", formData); // Specify the endpoint you want to call
        if (apiData) {
          setLoading(false);
        }
        reader.onloadend = () => {
          setSelectedAvatar(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedAvatar(null);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const [error, setError] = useState("");

  useEffect(() => {
    get("country/get-all").then((res) => {
      console.log("Countries", res);
      setOptions(res.country);
    });
  }, []);
  const navigate = useNavigate();
  return (
    <div className="auth-wrapper auth-cover mx-2">
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
      <Link to="/login" className="position-absolute top-0 start-0 m-3">
        <ChevronLeft onClick={() => navigate(-1)} />
      </Link>
      <Col className="auth-inner m-0 justify-content-center">
        <Col
          style={{ width: "100%", padding: "10px", marginTop: "5%" }}
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
              {t("Fill your Profile")}
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
              {t("Don’t worry you can always change it later.")}
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
              <Formik
                initialValues={{
                  first_name: "",
                  last_name: "",
                  phone: "",
                  date_of_birth: "",
                  country_id: "",
                  user_type: "coachee",
                }}
                validate={(values) => {
                  console.log(values);
                  const errors = {};
                  if (!values.first_name) {
                    errors.first_name = t("First name is required");
                  } else if (!values.last_name) {
                    errors.last_name = t("Last name is required");
                  }

                  if (!values.date_of_birth) {
                    errors.date_of_birth = t("Date of Birth is required");
                  }
                  const age = moment().diff(
                    moment(values.date_of_birth, "YYYY-MM-DD"),
                    "years"
                  );
                  if (age < 18) {
                    errors.date_of_birth = t(
                      "You must be at least 18 years old"
                    );
                  } else if (!values.phone) {
                    errors.phone = t("Phone is required");
                  } else if (!values.country_id) {
                    errors.country_id = t("Country is required");
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log(values);
                  try {
                    const postData = {
                      first_name: values.first_name,
                      last_name: values.last_name,
                      phone: values.phone,
                      date_of_birth: values.date_of_birth,
                      country_id: values.country_id.id,
                      role: "coachee",
                    };
                    const apiData = await put("users/updateProfile", postData); // Specify the endpoint you want to call
                    if (!apiData.success) {
                      setError(apiData.message);
                      setSubmitting(false);
                    } else {
                      console.log(3);
                      setSubmitting(false);
                      navigate("/coachee-interested");
                      //  open page dashboard/analytics
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
                    >
                      {/* <h2 className='brand-text text-primary ms-1'>Require Sign</h2> */}
                    </Link>

                    {/* <CardText className='mb-2'>Please sign-in to your account and start the adventure</CardText> */}
                    <Form className="auth-login-form  mb-2">
                      <div className="mb-1 text-center">
                        <Label for="profileImage" style={{ cursor: "pointer" }}>
                          {/* Wrap both file input and avatar inside a label */}
                          <div className="avatar-upload">
                            <Avatar
                              img={
                                loading
                                  ? "/public/icons/spinner.gif"
                                  : selectedAvatar || defaultAvatar
                              }
                              imgHeight="80"
                              imgWidth="80"
                              status=""
                              edit={true}
                            />
                            <Input
                              type="file"
                              name="profileImage"
                              id="profileImage"
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                          </div>
                        </Label>
                        <ErrorMessage name="profileImage">
                          {(msg) => (
                            <div className="error" style={{ color: "red" }}>
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className=" d-flex ">
                        <div>
                          <InputGroup>
                            <Field
                              name="first_name"
                              id="first_name"
                              placeholder={t("First Name")}
                              as={Input}
                              style={{
                                backgroundColor: "#EEEEEE",
                                borderRadius: "8px",
                              }}
                            />
                          </InputGroup>
                          <ErrorMessage name="first_name">
                            {(msg) => (
                              <div className="error" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                        <div style={{ width: "10px" }}></div>
                        <div className="mb-1">
                          <Field
                            name="last_name"
                            as={Input}
                            className="input-group-merge"
                            placeholder={t("Last Name")}
                            id="last_name"
                            style={{
                              backgroundColor: "#EEEEEE",
                              borderRadius: "8px",
                            }}
                          />
                          <ErrorMessage name="last_name">
                            {(msg) => (
                              <div className="error" style={{ color: "red" }}>
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                      <div className="mb-1">
                        <Field
                          name="date_of_birth"
                          as={Input}
                          placeholder={t("Date of Birth")}
                          className="input-group-merge"
                          id="date_of_birth"
                          type="date"
                          style={{
                            backgroundColor: "#EEEEEE",
                            borderRadius: "8px",
                          }}
                        />
                        <ErrorMessage name="date_of_birth">
                          {(msg) => (
                            <div className="error" style={{ color: "red" }}>
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                        {/* <ErrorMessage name="password" component={Error} /> */}
                      </div>

                      <div className="mb-1">
                        <Field name="phone">
                          {({ field, form }) => (
                            <PhoneInput
                              defaultCountry="DE" // Set default country
                              value={field.value}
                              onChange={(phone) =>
                                form.setFieldValue(field.name, phone)
                              }
                              international
                              numberInputProps={{
                                inputMode: "numeric",
                                autoComplete: "tel",
                                maxLength: "15",
                                style: {
                                  backgroundColor: "#EEEEEE",
                                  borderRadius: "8px",
                                  width: "100%",
                                  height: "calc(1.5em +.75rem + 1px)",
                                  padding: "9px",
                                  border: ".5px solid #ccc",
                                  outline: "none",
                                },
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage name="phone">
                          {(msg) => (
                            <div className="error" style={{ color: "red" }}>
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between"></div>
                        <Field
                          name="country_id"
                          as={SelectField}
                          placeholder={t("Select") + "..."}
                          className="input-group-merge"
                          id="country_id"
                          type="select"
                          style={{
                            backgroundColor: "#EEEEEE",
                            borderRadius: "8px",
                          }}
                          options={options}
                        ></Field>

                        <ErrorMessage name="country_id">
                          {(msg) => (
                            <div className="error" style={{ color: "red" }}>
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                        {/* <ErrorMessage name="password" component={Error} /> */}
                      </div>

                      <div className="error" style={{ color: "red" }}>
                        {error}
                      </div>
                      <Button
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        block
                        style={{ borderRadius: "35px", marginTop: "30px" }}
                      >
                        {isSubmitting ? (
                          <Spinner size="sm"> {t("Loading...")} </Spinner>
                        ) : (
                          t("NEXT")
                        )}
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
            height: "48%",
            position: "absolute",
            top: "50%",
            left: "80% ",
          }}
        />
      </Col>
    </div>
  );
};

export default Profile;
