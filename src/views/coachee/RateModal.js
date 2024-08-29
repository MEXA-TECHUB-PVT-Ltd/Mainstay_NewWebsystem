import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { authPost } from "../../urls/api";
import { useTranslation } from "react-i18next";

const FilledStar = ({ size = 60, onClick }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: "pointer" }}
    onClick={onClick}
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      fill="#ffc107"
    />
  </svg>
);

const OutlinedStar = ({ size = 60, onClick }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: "pointer" }}
    onClick={onClick}
  >
    <path
      d="M22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.03 4.38.38-3.32 2.88 1 4.28L12 15.4z"
      fill="#e4e5e9"
    />
  </svg>
);

const RateModal = ({
  isRateModal,
  handleRateModal,
  isRatingExists,
  coachId,
  sessionsId,
  ratingData,
  checkReviewExists,
  fetchCoachReviews,
  fetchAvgRating,
}) => {
  const maxChars = 250; // Maximum character limit
  const ratingResponse = parseInt(ratingData?.rating) || 0;
  const commentResponse = ratingData?.comment || "";
  const [rating, setRating] = useState(ratingResponse);
  const [comment, setComment] = useState(commentResponse);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const token = JSON.parse(localStorage.getItem("loginUserData"))?.accessToken;

  const handleRatingChange = (newRating) => {
    setRating(newRating === rating ? newRating - 0.5 : newRating);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      // Ensure we do not exceed the maximum character limit
      setComment(value);
    }
  };

  const handleRating = async () => {
    setLoading(true);
    try {
      const url = isRatingExists ? "rating/update" : "rating/add";
      const data = isRatingExists
        ? {
            id: ratingData.id,
            rating,
            comment,
          }
        : {
            coachId,
            sessionsId,
            rating,
            comment,
          };
      const response = await authPost(url, data, token);
      if (response.success) {
        handleRateModal();
        checkReviewExists();
        fetchCoachReviews();
        fetchAvgRating();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isRateModal}
      toggle={handleRateModal}
      size="md"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <ModalHeader toggle={handleRateModal}>
        <p
          style={{
            fontWeight: "600",
            fontSize: "18px",
            // margin: "30px 0",
            textAlign: "center",
          }}
        >
          {isRatingExists ? t("Update the Rating") : t("Rate the Coach")}
        </p>
      </ModalHeader>
      <ModalBody
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <span key={i} style={{ position: "relative" }}>
                {ratingValue <= Math.ceil(rating) ? (
                  <FilledStar
                    size={25}
                    onClick={() => handleRatingChange(ratingValue)}
                  />
                ) : (
                  <OutlinedStar
                    size={25}
                    onClick={() => handleRatingChange(ratingValue)}
                  />
                )}
              </span>
            );
          })}
        </div>
        <Input
          type="textarea"
          placeholder={t("Enter your comment...")}
          value={comment}
          onChange={handleCommentChange}
          maxLength={maxChars} // Set the maximum length attribute for validation
          style={{
            marginTop: "20px",
            width: "80%",
            maxWidth: "500px",
          }}
        />
        <div
          style={{
            alignSelf: "flex-end",
            marginRight: "10%",
            fontSize: "0.8rem",
          }}
        >
          {`${comment.length}/${maxChars}`}
        </div>
        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <Button
            color="primary"
            style={{ borderRadius: "35px", width: "100%" }}
            disabled={rating === 0}
            onClick={handleRating}
          >
            {loading ? (
              <Spinner style={{ width: "15px", height: "15px" }} />
            ) : isRatingExists ? (
              t("Update")
            ) : (
              t("Submit")
            )}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default RateModal;
