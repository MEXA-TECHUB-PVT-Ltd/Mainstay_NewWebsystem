import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Spinner,
  Alert,
} from "reactstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BASE_URL } from "../../../../urls/api";
import { useTranslation } from "react-i18next";

const WithdrawModal = ({ handleToggle, isOpen, coachId, refetch }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleWithdraw = async (values) => {
    // Handle withdrawal logic here
    console.log(values.amount);
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}payments/withdraw`, {
        amount: values.amount,
        coachId,
      });
      if (response.data.success) {
        handleToggle();
        refetch();
      }
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message || "Couldn't make the withdraw request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required(t("Amount is required"))
      .positive(t("Amount must be positive"))
      .integer(t("Amount must be an integer")),
  });

  return (
    <>
      <Modal style={{ marginTop: "10%" }} isOpen={isOpen} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>
          <p style={{ fontWeight: "bold", fontSize: "20px" }}>
            {t("Choose Duration")}
          </p>
        </ModalHeader>

        <Formik
          initialValues={{ amount: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleWithdraw(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {error && (
                <Alert color="danger" className="mx-2">
                  {error}
                </Alert>
              )}
              <ModalFooter className="justify-content-center">
                <FormGroup>
                  <Label for="amount"> {t("Amount to Withdraw")} </Label>
                  <Field
                    type="number"
                    name="amount"
                    id="amount"
                    className={`form-control ${
                      errors.amount && touched.amount ? "is-invalid" : ""
                    }`}
                  />
                  <FormFeedback>{errors.amount}</FormFeedback>
                </FormGroup>

                <Button
                  style={{ borderRadius: "35px" }}
                  color="primary"
                  className="justify-content-center w-75"
                  type="submit"
                >
                  {isLoading ? <Spinner size="sm" /> : t("Withdraw")}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default WithdrawModal;
