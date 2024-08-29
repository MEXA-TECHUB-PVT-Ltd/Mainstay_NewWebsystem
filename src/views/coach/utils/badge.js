import { authGet } from "../../../urls/api";
import filledStar from "../../../@core/assets/images/logo/fill_star.png";
import emptyStar from "../../../@core/assets/images/logo/rating.png";
import { t } from "i18next";

export const fetchAvgRating = async (id, setAvgRating) => {
  try {
    const response = await authGet(
      `rating/getAverageRatingForCoach?coach_id=${id}`
    );
    if (response.success) {
      setAvgRating(response?.averageRating);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchBadges = async (id, setBadges) => {
  try {
    const response = await authGet(`rating/getCoachBadges/${id}`);
    if (response.success) {
      setBadges(response?.result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchCoachReviews = async (
  id,
  setReviewsData,
  setRatingLoading
) => {
  setRatingLoading(true);
  try {
    const response = await authGet(`rating/getAllByCoach/${id}`);
    if (response.success) {
      const result = response.result;
      setReviewsData(result);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setRatingLoading(false);
  }
};

export const renderStars = (rating) => {
  if (!rating) return null;

  const fullStars = Math.floor(rating);
  const halfStarNeeded = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStarNeeded ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <img key={`full-${i}`} src={filledStar} alt="Star" width={25} />
      ))}
      {/* {halfStarNeeded && <img src={emptyStar} alt="Half Star" width={30} />}
      {[...Array(emptyStars)].map((_, i) => (
        <img key={`empty-${i}`} src={emptyStar} alt="Empty Star" width={25} />
      ))} */}
    </>
  );
};

export const badges = [
  {
    title: "Bronze",
    criteria: t("5 reviews min. 4 stars"),
    requiredBadge: "Bronze",
  },
  {
    title: "Silver",
    criteria: t("15 reviews min. 4 stars"),
    requiredBadge: "Silver",
  },
  {
    title: "Gold",
    criteria: t("25 reviews min. 4 stars"),
    requiredBadge: "Gold",
  },
  {
    title: "Platinum",
    criteria: t("50 reviews min. 4 stars"),
    requiredBadge: "Platinum",
  },
];
export const coacheeBadges = [
  {
    title: "Bronze",
    criteria: t("After 30 Wellcoins"),
    requiredBadge: "Bronze",
  },
  {
    title: "Silver",
    criteria: t("After 60 Wellcoins"),
    requiredBadge: "Silver",
  },
  {
    title: "Gold",
    criteria: t("After 100 Wellcoins"),
    requiredBadge: "Gold",
  },
  {
    title: "Platinum",
    criteria: t("After 300 Wellcoins"),
    requiredBadge: "Platinum",
  },
];
