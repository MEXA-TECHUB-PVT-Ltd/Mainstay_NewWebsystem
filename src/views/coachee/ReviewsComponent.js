import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import moment from "moment";
import filledStar from "../../@core/assets/images/logo/fill_star.png";

const ReviewsComponent = ({ reviewsData, style }) => {
  const renderStars = (rating) => {
    return [...Array(rating)].map((_, i) => (
      <img key={i} src={filledStar} alt="Star" width={16} />
    ));
  };

  return (
    <div style={style}>
      {reviewsData?.length === 0 && <p>No Review Found</p>}
      {reviewsData?.map((review) => (
        <Card
          key={review.id}
          className="my-1"
          style={{
            boxShadow: "none",
            border: "1px solid #e3e6e8",
            borderRadius: "0.25rem",
          }}
        >
          <CardBody>
            <Row>
              <Col sm="12">
                <div style={{ display: "flex", alignItems: "center" }}>
                  {review?.coachee.profile_pic ? (
                    <img
                      src={review.coachee.profile_pic}
                      alt={`${review.coachee.first_name} ${review.coachee.last_name}`}
                      className="img-fluid rounded-circle"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                      }}
                    >
                      <span className="text-white">N/A</span>
                    </div>
                  )}
                  <div>
                    <div
                      style={{ fontWeight: "bold" }}
                    >{`${review.coachee.first_name} ${review.coachee.last_name}`}</div>
                    <div>{renderStars(parseInt(review.rating))}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    {moment(review.created_at).format("DD/MM/YYYY HH:mm")}
                  </div>
                </div>
                <p style={{ marginBottom: "0", marginTop: "10px" }}>
                  {review.comment}
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsComponent;
