import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "react-feather";
import {
  Row,
  Col,
  CardTitle,
  Label,
  Input,
  Button,
  Spinner,
  Modal,
  ModalHeader,
} from "reactstrap";
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import { authPost, put } from "../../../../urls/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const DurationModal = ({
  isModalOpen,
  toggleModal,
  duration: existingDuration,
  refetch,
}) => {
  const { t } = useTranslation();
  console.log(existingDuration);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState([
    { value: "30", amount: "" },
    { value: "60", amount: "" },
    { value: "90", amount: "" },
  ]);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (existingDuration?.details) {
      // Prepopulate the duration state with existingDuration details
      setDuration(existingDuration.details);

      // Set selectedDuration based on whether an amount is provided
      const selected = existingDuration.details
        .filter((item) => item.amount)
        .map((item) => item.value);
      setSelectedDuration(selected);
    }
  }, [existingDuration]);
  const handleCheckboxChange = (languageId) => {
    if (selectedDuration.includes(languageId)) {
      setSelectedDuration(selectedDuration.filter((id) => id !== languageId));
    } else {
      setSelectedDuration([...selectedDuration, languageId]);
    }
  };
  const handleChange = (index, newAmount) => {
    console.log(newAmount);
    const updatedDuration = [...duration];

    // Update the amount property for the specified index
    updatedDuration[index] = {
      ...updatedDuration[index],
      amount: newAmount,
    };

    // Set the updated state
    setDuration(updatedDuration);
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const result = await put("duration/update", {
        durationDetails: duration,
      });

      if (result) {
        // const status = await put("coach/update", { is_completed: true });
        setLoading(false);
        refetch();
        toggleModal();
        toast.success(t("Duration updated"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        <h4 style={{ fontWeight: "bold", color: "#0F6D6A" }}>
          {t("Update Duration")}
        </h4>
      </ModalHeader>

      <div className="px-4 py-1">
        <p style={{ fontSize: "12px" }}> {t("Edit duration")} </p>
        <>
          <div className="mb-1 ">
            {duration &&
              duration?.map((item, index) => (
                <div key={index} className=" justify-content-between mt-2">
                  <div
                    style={{
                      backgroundColor: selectedDuration.includes(item.value)
                        ? "#0F6D6A"
                        : "#EEEEEE",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    key={item.id}
                    className="d-flex justify-content-between mt-2 pb-1"
                    onClick={() => handleCheckboxChange(item.value)}
                  >
                    <Label
                      disabled
                      style={{
                        color: selectedDuration.includes(item.value)
                          ? "#EEEEEE"
                          : "#767676",
                      }}
                    >
                      {item.value + " " + t("minutes")}
                    </Label>
                    <Input
                      value={item.id}
                      onChange={() => handleCheckboxChange(item.value)}
                      checked={selectedDuration.includes(item.value)}
                      type="checkbox"
                      id="remember-me"
                    />
                  </div>
                  {selectedDuration.includes(item.value) && (
                    <Input
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#EEEEEE",
                      }}
                      name="amount"
                      value={item.amount}
                      placeholder="Enter Amount (CHF)"
                      type={"number"}
                      id="remember-me"
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                  )}
                </div>
              ))}
          </div>

          <div className="error" style={{ color: "red" }}>
            {error}
          </div>
          <Button
            disabled={loading}
            color="primary"
            type="submit"
            style={{ borderRadius: "35px", marginTop: "30px" }}
            onClick={handleSubmit}
            block
          >
            {loading ? <Spinner size="sm"></Spinner> : t("Update")}
          </Button>
        </>
      </div>
    </Modal>
  );
};

export default DurationModal;
