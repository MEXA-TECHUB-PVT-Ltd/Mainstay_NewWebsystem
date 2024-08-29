import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Label, Spinner, ModalHeader } from "reactstrap";
import { Formik, ErrorMessage, Form } from "formik";
import { useFetchLanguages } from "../../hooks/useFetchLanguages";
import { updateLanguages } from "../../services/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const LanguageModal = ({ isModalOpen, toggleModal, user, refetch }) => {
  const { t } = useTranslation();
  const existingLanguages = user?.details?.languages; // Array of language names
  const { languages, loading } = useFetchLanguages();
  // Initialize with empty array, will store objects { id: Number, name: String }
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Adjust to create an array of objects from the existing names and the full languages list
    if (languages.length > 0 && existingLanguages) {
      const preSelectedLanguages = languages
        .filter((lang) => existingLanguages.includes(lang.name))
        .map((lang) => ({ id: lang.id, name: lang.name }));
      setSelectedLanguages(preSelectedLanguages);
    }
  }, [languages, existingLanguages]);

  const handleCheckboxChange = (selectedLanguage) => {
    const isAlreadySelected = selectedLanguages.some(
      (lang) => lang.id === selectedLanguage.id
    );
    if (isAlreadySelected) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang.id !== selectedLanguage.id)
      );
    } else {
      setSelectedLanguages([...selectedLanguages, selectedLanguage]);
    }
  };

  const filterLanguages = () =>
    languages.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        <h4 style={{ fontWeight: "bold", color: "#0F6D6A" }}>
          {t("Update Languages")}
        </h4>
      </ModalHeader>

      <div className="px-4 py-1">
        <Formik
          initialValues={{ language_ids: [] }}
          onSubmit={async (_, { setSubmitting }) => {
            try {
              // Extract IDs for submission
              const languageIds = selectedLanguages.map((lang) => lang.id);
              await updateLanguages(languageIds);
              refetch();
              toggleModal();
              toast.success(t("Language updated"), {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } catch (error) {
              setError("An error occurred while updating.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form
              className="auth-login-form mt-2"
              style={{ textAlign: "-webkit-center" }}
            >
              <Input
                type="text"
                placeholder={t("Search...")}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              <div
                className="mb-1"
                style={{ height: "350px", overflow: "auto" }}
              >
                {filterLanguages().length === 0 && (
                  <p> {t("no result found")} </p>
                )}
                {loading ? (
                  <Spinner />
                ) : (
                  filterLanguages().map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between mt-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleCheckboxChange({ id: item.id, name: item.name })
                      }
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
                        value={item.id} // Keep value as id for identification
                        onChange={() =>
                          handleCheckboxChange({ id: item.id, name: item.name })
                        } // Pass object with name and id
                        checked={selectedLanguages.some(
                          (lang) => lang.id === item.id
                        )}
                        type="checkbox"
                        id={`lang-${item.id}`}
                      />
                    </div>
                  ))
                )}
              </div>
              <ErrorMessage
                name="language_ids"
                component="div"
                className="error"
                style={{ color: "red" }}
              />
              <div className="error" style={{ color: "red" }}>
                {error}
              </div>
              <Button
                color="primary"
                type="submit"
                disabled={isSubmitting || selectedLanguages.length === 0}
                style={{ borderRadius: "35px", maxWidth: "80%" }}
                block
              >
                {isSubmitting ? <Spinner size="sm" /> : t("Update")}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default LanguageModal;
