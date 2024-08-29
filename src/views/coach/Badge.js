import React, { useEffect, useState } from "react";
import { Card } from "reactstrap";
import AllReview from "./components/badge/AllReview";
import { fetchAvgRating, fetchBadges, fetchCoachReviews } from "./utils/badge";
import Badges from "./components/badge/Badges";

const Badge = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [avgRating, setAvgRating] = useState();
  const [userBadges, setUserBadges] = useState();
  const data = JSON.parse(localStorage.getItem("loginUserData")) || [];
  const id = parseInt(data.user.id);

  useEffect(() => {
    if (id) {
      fetchAvgRating(id, setAvgRating);
      fetchCoachReviews(id, setReviewsData, setRatingLoading);
      fetchBadges(id, setUserBadges);
    }
  }, [id]);

  return (
    <div className="d-flex justify-content-between flex-wrap gap-5">
      <AllReview
        reviewsData={reviewsData}
        avgRating={avgRating}
        ratingLoading={ratingLoading}
      />
      <Badges userBadge={userBadges} />
    </div>
  );
};

export default Badge;
