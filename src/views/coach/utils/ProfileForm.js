import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { Input, Button, Spinner } from "reactstrap";
import AvatarUpload from "./AvatarUpload";
import { validateProfile } from "./validation";
import { useTranslation } from "react-i18next";

const ProfileForm = ({ user, onSubmit, onFileChange, error }) => {
  const [descriptionLength, setDescriptionLength] = React.useState(0);
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        about: user?.about || "",
      }}
      validate={validateProfile}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="auth-login-form mb-2">
          <AvatarUpload user={user} onFileChange={onFileChange} />
          <div className="mb-1 d-flex ">
            <div>
              <Field
                style={{
                  backgroundColor: "#EEEEEE",
                  borderRadius: "8px",
                }}
                name="first_name"
                as={Input}
                className="input-group-merge"
                placeholder="First Name"
                id="first_name"
              />
              <ErrorMessage name="first_name">
                {(msg) => (
                  <div className="error" style={{ color: "red" }}>
                    {msg}
                  </div>
                )}
              </ErrorMessage>
            </div>
            <div style={{ width: "10px" }}></div>
            <div>
              <Field
                style={{
                  backgroundColor: "#EEEEEE",
                  borderRadius: "8px",
                }}
                name="last_name"
                as={Input}
                className="input-group-merge"
                placeholder="Last Name"
                id="last_name"
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
            <div className="d-flex justify-content-between"></div>
            <Field
              style={{
                backgroundColor: "#EEEEEE",
                borderRadius: "8px",
              }}
              name="about"
              as={Input}
              placeholder="Description"
              className="input-group-merge"
              id="about"
              type="textarea"
              rows={5}
              cols={60}
              maxLength={250}
              onChange={(e) => {
                setDescriptionLength(e.target.value.length); // Update character count
                setFieldValue("about", e.target.value); // Update formik state
              }}
            />
            <ErrorMessage name="about">
              {(msg) => (
                <div className="error" style={{ color: "red" }}>
                  {msg}
                </div>
              )}
            </ErrorMessage>
            <div className="character-counter">{descriptionLength}/250</div>
          </div>

          <div className="error" style={{ color: "red" }}>
            {error}
          </div>
          <Button color="primary" type="submit" disabled={isSubmitting} block>
            {isSubmitting ? <Spinner size="sm" /> : t("Update")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
