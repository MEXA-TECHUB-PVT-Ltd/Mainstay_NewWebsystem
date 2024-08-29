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
  Modal,
  ModalHeader,
} from "reactstrap";
import logo from "@assets/images/logo/logo.png";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import { Formik, Field, ErrorMessage, Form } from "formik";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useState, useEffect } from "react";
import { get, put } from "../../../../urls/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Interest = ({ isModalOpen, toggleModal, refetch, interests }) => {
  const { t } = useTranslation();
  const { skin } = useSkin();
  const [error, setError] = useState("");
  const [coachingArea, setCoachingArea] = useState([]);
  const [selectedCoachingArea, setSelectedCoachingArea] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (coaching_area_id) => {
    if (selectedCoachingArea?.includes(coaching_area_id)) {
      setSelectedCoachingArea(
        selectedCoachingArea?.filter((id) => id !== coaching_area_id)
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
    get("coach-area/get-all").then((res) => {
      // setLoading(true);
      setCoachingArea(res?.result || []);

      // Extract IDs of user's current interests
      const currentInterestIds = res?.result
        ?.filter((area) => interests?.includes(area?.name))
        ?.map((filteredArea) => filteredArea?.id);

      // Set selected coaching areas based on user's interests
      setSelectedCoachingArea(currentInterestIds);

      setLoading(false);
    });
  }, [interests]);

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const navigate = useNavigate();
  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        <h4 style={{ fontWeight: "bold", color: "#0F6D6A" }}>
          {t("Update Interest")}
        </h4>
      </ModalHeader>

      <div className="px-4 py-2">
        <Formik
          initialValues={{ coaching_area_ids: [] }}
          validate={(values) => {
            const errors = {};
            if (selectedCoachingArea.length === 0) {
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
                // console.log(apiData.result);
                setSubmitting(false);
                refetch();
                toggleModal();

                toast.success(t("Interests updated"), {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });

                // navigate("/coachee-profile-complete");

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
                        {item.german_name}
                      </Label>
                      <Input
                        value={item.id}
                        onChange={() => handleCheckboxChange(item.id)}
                        checked={selectedCoachingArea?.includes(item.id)}
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
                  {isSubmitting ? <Spinner size="sm" /> : t("Update")}
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default Interest;
