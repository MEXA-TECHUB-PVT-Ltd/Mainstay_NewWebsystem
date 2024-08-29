import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, ModalHeader, Spinner } from "reactstrap";
import { updateCoachingAreas } from "../../services/api";
import { useFetchCoachingAreas } from "../../hooks/useFetchCoachingAreas";
import InterestForm from "../profile/InterestForm";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const InterestModal = ({ isModalOpen, toggleModal, user, refetch }) => {
  const { t } = useTranslation();
  const interests = useMemo(
    () => user?.coaching_areas?.map((interest) => interest.name) || [],
    [user]
  );
  const { coachingAreas, loading, error: fetchError } = useFetchCoachingAreas();
  const [selectedCoachingArea, setSelectedCoachingArea] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (coachingAreas?.length > 0 && interests.length > 0) {
      const selectedIds = coachingAreas
        .filter((ca) => interests.includes(ca.name))
        .map((ca) => ca.id);
      setSelectedCoachingArea(selectedIds);
    }
  }, [coachingAreas, interests]);

  const handleCheckboxChange = useCallback((coachingAreaId) => {
    setSelectedCoachingArea((prev) =>
      prev.includes(coachingAreaId)
        ? prev.filter((id) => id !== coachingAreaId)
        : [...prev, coachingAreaId]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await updateCoachingAreas(selectedCoachingArea);
      toggleModal();
      refetch();
      toast.success(t("Coaching areas updated"), {
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
      setIsSubmitting(false);
    }
  }, [selectedCoachingArea, refetch, toggleModal]);

  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        <h4 style={{ fontWeight: "bold", color: "#0F6D6A" }}>
          {t("Update Coaching Areas")}
        </h4>
      </ModalHeader>

      <div className="px-4 py-1">
        {fetchError && (
          <div className="error" style={{ color: "red" }}>
            {fetchError}
          </div>
        )}
        <InterestForm
          onSubmit={handleSubmit}
          coachingAreas={coachingAreas}
          selectedCoachingArea={selectedCoachingArea}
          handleCheckboxChange={handleCheckboxChange}
          loading={loading}
          isSubmitting={isSubmitting}
        />
      </div>
    </Modal>
  );
};

export default InterestModal;
