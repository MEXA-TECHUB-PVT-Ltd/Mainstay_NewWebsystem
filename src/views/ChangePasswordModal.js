import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Container,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { useChangePasswordMutation } from "../redux/dashboardApi";
import { Eye, EyeOff, Lock } from "react-feather";
import { t } from "i18next";

const ChangePasswordModal = ({ open, toggle }) => {
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const [changePassword, { isLoading, isSuccess, isError, error }] =
    useChangePasswordMutation();
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required(t("Current password is required")),
    newPassword: Yup.string()
      .min(6, t("Password must be at least 6 characters long"))
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t("Passwords must match"))
      .required(t("Confirm password is required")),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const body = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };
      const response = await changePassword(body).unwrap();

      setFeedbackMessage(t("Password successfully changed."));
      resetForm({});
    } catch (err) {
      setFeedbackMessage(
        err.data ? err.data.message : "An error occurred. Please try again."
      );
    }
  };

  console.log(open);

  return (
    <Modal
      isOpen={open}
      toggle={toggle}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <>
        <ModalHeader toggle={toggle}>
          <h3 className=""> {t("Change Password")} </h3>
        </ModalHeader>
        <ModalBody>
          {feedbackMessage && (
            <Alert color={isSuccess ? "success" : "danger"}>
              {feedbackMessage}
            </Alert>
          )}
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <FormGroup>
                    <Label for="currentPassword">
                      {" "}
                      {t("Current Password")}{" "}
                    </Label>
                    <InputGroup>
                      <InputGroupText
                        style={{
                          borderRight: "none",
                          backgroundColor:
                            errors.currentPassword && touched.currentPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                          borderBottomLeftRadius: "25%",
                          borderTopLeftRadius: "25%",
                        }}
                      >
                        <Lock />
                      </InputGroupText>
                      <Field
                        name="currentPassword"
                        as={Input}
                        type={showPassword.current ? "text" : "password"}
                        invalid={
                          errors.currentPassword && touched.currentPassword
                        }
                        style={{
                          paddingLeft: "0px",
                          paddingRight: "0px",
                          borderLeft: "none",
                          borderRight: "none",
                          backgroundColor:
                            errors.currentPassword && touched.currentPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                        }}
                      />
                      <InputGroupText
                        onClick={() => togglePasswordVisibility("current")}
                        style={{
                          borderBottomRightRadius: "25%",
                          borderTopRightRadius: "25%",
                          cursor: "pointer",
                          borderLeft: "none",
                          backgroundColor:
                            errors.currentPassword && touched.currentPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                        }}
                      >
                        {showPassword.current ? <EyeOff /> : <Eye />}
                      </InputGroupText>
                      <ErrorMessage
                        name="currentPassword"
                        component={FormFeedback}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* New Password Field */}
                  <FormGroup>
                    <Label for="newPassword"> {t("New Password")} </Label>
                    <InputGroup>
                      <InputGroupText
                        style={{
                          borderRight: "none",
                          backgroundColor:
                            errors.newPassword && touched.newPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                          borderBottomLeftRadius: "25%",
                          borderTopLeftRadius: "25%",
                        }}
                      >
                        <Lock />
                      </InputGroupText>
                      <Field
                        name="newPassword"
                        as={Input}
                        type={showPassword.new ? "text" : "password"}
                        invalid={errors.newPassword && touched.newPassword}
                        style={{
                          paddingLeft: "0px",
                          paddingRight: "0px",
                          borderLeft: "none",
                          borderRight: "none",
                          backgroundColor:
                            errors.newPassword && touched.newPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                        }}
                      />
                      <InputGroupText
                        onClick={() => togglePasswordVisibility("new")}
                        style={{
                          borderBottomRightRadius: "25%",
                          borderTopRightRadius: "25%",
                          cursor: "pointer",
                          borderLeft: "none",
                          backgroundColor:
                            errors.newPassword && touched.newPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                        }}
                      >
                        {showPassword.new ? <EyeOff /> : <Eye />}
                      </InputGroupText>
                      <ErrorMessage
                        name="newPassword"
                        component={FormFeedback}
                      />
                    </InputGroup>
                  </FormGroup>

                  {/* Confirm New Password Field */}
                  <FormGroup>
                    <Label for="confirmPassword">
                      {" "}
                      {t("Confirm New Password")}{" "}
                    </Label>
                    <InputGroup>
                      <InputGroupText
                        style={{
                          borderRight: "none",
                          backgroundColor:
                            errors.confirmPassword && touched.confirmPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                          borderBottomLeftRadius: "25%",
                          borderTopLeftRadius: "25%",
                        }}
                      >
                        <Lock />
                      </InputGroupText>
                      <Field
                        name="confirmPassword"
                        as={Input}
                        type={showPassword.confirm ? "text" : "password"}
                        invalid={
                          errors.confirmPassword && touched.confirmPassword
                        }
                        style={{
                          paddingLeft: "0px",
                          paddingRight: "0px",
                          borderLeft: "none",
                          borderRight: "none",
                          backgroundColor:
                            errors.confirmPassword && touched.confirmPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                        }}
                      />
                      <InputGroupText
                        onClick={() => togglePasswordVisibility("confirm")}
                        style={{
                          borderBottomRightRadius: "25%",
                          borderTopRightRadius: "25%",
                          cursor: "pointer",
                          borderLeft: "none",
                          backgroundColor:
                            errors.confirmPassword && touched.confirmPassword
                              ? "#f8d7da"
                              : "#EEEEEE",
                        }}
                      >
                        {showPassword.confirm ? <EyeOff /> : <Eye />}
                      </InputGroupText>
                      <ErrorMessage
                        name="confirmPassword"
                        component={FormFeedback}
                      />
                    </InputGroup>
                  </FormGroup>

                  <Button
                    type="submit"
                    color="primary"
                    disabled={isLoading}
                    style={{ width: "100%", marginBottom: "20px" }}
                  >
                    {isLoading ? "Changing..." : t("Change Password")}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </ModalBody>
      </>
    </Modal>
  );
};

export default ChangePasswordModal;
