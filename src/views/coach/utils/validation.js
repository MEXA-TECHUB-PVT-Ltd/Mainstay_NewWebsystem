import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const validateProfile = (values) => {
  const errors = {};

  // First name validation
  if (!values.first_name.trim()) {
    errors.first_name = t("First name is required");
  }

  // Last name validation
  if (!values.last_name.trim()) {
    errors.last_name = t("Last name is required");
  }

  // Description validation
  if (!values.about.trim()) {
    errors.about = t("Description is required");
  }

  return errors;
};
