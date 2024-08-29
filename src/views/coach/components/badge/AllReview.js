import React from "react";
import ReviewsComponent from "../../../coachee/ReviewsComponent";
import { Card, Spinner } from "reactstrap";
import { renderStars } from "../../utils/badge";
import { useTranslation } from "react-i18next";

const AllReview = ({ reviewsData, avgRating, ratingLoading }) => {
  const { t } = useTranslation();

  const isAvg = avgRating ? avgRating : "1.0";
  return (
    <Card
      className="flex-grow-1"
      style={{
        width: "680px",
        maxWidth: "850px",
        minWidth: "0px",
        // marginLeft: "25px",
        height: "750px",
        maxHeight: "800px",
      }}
    >
      <div className="py-2 mb-2" style={{ backgroundColor: "#0F6D6A" }}>
        <div className="text-center">
          <div className="">
            <h1 style={{ color: "#FFF" }}>{isAvg}</h1>
            <div className="my-1">{renderStars(parseInt(isAvg))}</div>
          </div>
          <h1 style={{ color: "#FFF" }}> {t("Overall Rating")}</h1>
        </div>
      </div>
      <h3 className="ms-2"> {t("All Reviews")} </h3>
      {ratingLoading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <ReviewsComponent
          reviewsData={reviewsData}
          style={{
            maxHeight: "450px",
            overflowY: "scroll",
            padding: "15px",
          }}
        />
      )}
    </Card>
  );
};

export default AllReview;
