import React, { useMemo, useCallback } from "react";
import { Formik, ErrorMessage, Form } from "formik";
import { Button, Spinner, Input, Label } from "reactstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CheckboxWithLabel = React.memo(({ item, onChange, checked }) => {
  const { lng } = useSelector((state) => state.languageSlice);
  return (
    <div
      style={{
        backgroundColor: "#EEEEEE",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      className="d-flex justify-content-between mt-1"
      onClick={() => onChange(item.id)}
    >
      <Label className="d-flex align-items-center">
        {item.icon && (
          <img
            src={item.icon}
            alt={item.name + " Icon"}
            className="me-2"
            style={{ width: "20px", height: "20px" }}
          />
        )}
        {lng === "ge" ? item.german_name : item.name}
      </Label>
      <Input
        value={item.id}
        onChange={() => onChange(item.id)}
        checked={checked}
        type="checkbox"
        style={{ cursor: "pointer" }}
      />
    </div>
  );
});

const InterestForm = ({
  onSubmit,
  coachingAreas,
  selectedCoachingArea,
  handleCheckboxChange,
  loading,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const handleCheckboxChangeMemoized = useCallback(handleCheckboxChange, []);
  const coachingAreaComponents = useMemo(() => {
    return coachingAreas?.map((item) => (
      <CheckboxWithLabel
        key={item.id}
        item={item}
        checked={selectedCoachingArea.includes(item.id)}
        onChange={handleCheckboxChangeMemoized}
      />
    ));
  }, [coachingAreas, selectedCoachingArea, handleCheckboxChangeMemoized]);

  return (
    <Formik
      initialValues={{ coaching_area_ids: selectedCoachingArea }}
      validate={(values) => {
        const errors = {};
        if (selectedCoachingArea.length === 0) {
          errors.coaching_area_ids = "At least one coaching area is required";
        }
        return errors;
      }}
      onSubmit={onSubmit}
    >
      {() => (
        <Form
          className="auth-login-form"
          style={{ minHeight: "500px", textAlignLast: "center" }}
        >
          {loading ? <Spinner /> : coachingAreaComponents}
          <ErrorMessage
            name="coaching_area_ids"
            component="div"
            className="error"
            style={{ color: "red" }}
          />
          {!loading && (
            <Button
              style={{ marginTop: "50px", borderRadius: "35px" }}
              color="primary"
              type="submit"
              disabled={isSubmitting || selectedCoachingArea.length === 0}
              block
            >
              {isSubmitting ? <Spinner size="sm" /> : t("Update")}
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default InterestForm;
