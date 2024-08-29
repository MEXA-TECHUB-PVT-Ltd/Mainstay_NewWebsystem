import { useEffect, useState } from "react";
import { Card, CardBody, Button, Container, Row, Col } from "reactstrap";
import Avatar from "@components/avatar";
import { format } from "date-fns";

import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { authGet, get } from "../../urls/api";
import { Calendar, File, MessageCircle, Star } from "react-feather";
import SessionResponse from "../../utility/SessionResponse";
import Loader from "../../utility/Loader";
import { weekdays } from "moment";

import "./video.css";

import coachHome from "/coachHome.png";
import { getBadgeImage } from "../../utility/badges";
import { useTranslation } from "react-i18next";

const Home = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [requested, setRequested] = useState([]);
  const [coming, setComing] = useState([]);
  const [value, setValue] = useState();
  const [selectedRequest, setSelectedRequest] = useState();
  const [requestModal, setRequestModal] = useState(false);
  const [acceptedSessionError, setAcceptedSessionError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState();
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const req = await authGet(
        "session/get-by-coach?pageSize=6&status=pending,accepted,rejected"
      );
      const coming = await authGet(
        "session/get-by-coach?pageSize=6&status=paid"
      );

      setRequested(req?.sessions);
      setComing(coming?.sessions);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // console.log(requested);
  // console.log(coming);

  const handleClick = (id) => {
    setBookingModal(id);
  };
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleChange = (e) => {
    setType(e.target.value);
  };
  const handleSession = () => {};
  const toggleBookingModal = () => {
    setBookingModal(!bookingModal);
  };

  return (
    <div className="">
      {loading && <Loader />}
      <h2 className="pb-2"> {t("Home")} </h2>
      {requested?.length === 0 && coming?.length === 0 ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh", width: "100%" }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={coachHome}
              alt="Coach Home"
              style={{ maxWidth: "100%", height: "auto", maxHeight: "250px" }}
            />
            <h3
              style={{
                color: "#0F6D6A",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {t("Welcome Onboard Coach!")}
            </h3>
            <p>
              {t(
                "Your coaching journey begins here. Let's empower lives together!"
              )}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              // alignItems: 'center',
              // flexWrap: "wrap",
            }}
            className="grow-custom"
          >
            <div
              lg="6"
              md="6"
              xl="6"
              style={{
                minHeight: "100px",
                border: "2px solid #f8f8f8",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffff",
                padding: "10px",
                marginRight: "10px",
                borderRadius: "25px",
              }}
              className="flex-grow-1 max-width"
            >
              <div className="d-flex justify-content-between">
                <h2
                  style={{
                    fontSize: "19px",
                    fontWeight: "600",
                    paddingBottom: "20px",
                    color: "#0F6D6A",
                  }}
                >
                  <File size={18} /> {t("Session Requests")}
                </h2>
                <Button
                  style={{
                    height: "35px",
                    borderRadius: "25px",
                    // marginBottom: "20px",
                  }}
                  size="sm"
                  color="primary"
                  onClick={() =>
                    navigate("/coach/coaching?status=SESSION_REQUEST")
                  }
                >
                  {t("See All")}
                </Button>
              </div>
              <div className="">
                <div className="row">
                  {requested?.length === 0 && (
                    <p style={{ textAlign: "center" }}>
                      {" "}
                      {t("No data available")}.{" "}
                    </p>
                  )}
                  {requested?.map((item) => (
                    <div
                      className="col-lg-6 mb-4"
                      style={{
                        cursor: "pointer",
                        marginBottom: "15px",
                      }}
                      onClick={() => {
                        setSelectedRequest(item), setRequestModal(true);
                      }}
                      key={item?.session_info?.id}
                    >
                      <Card
                        style={{
                          borderRadius: "15px",
                          height: "auto",
                        }}
                      >
                        <CardBody style={{ paddingLeft: "5px" }}>
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <Avatar
                                  img={
                                    item?.session_info?.coachee_profile_pic ||
                                    defaultAvatar
                                  }
                                  imgHeight="40"
                                  imgWidth="40"
                                />
                                {item?.session_info?.coachee_badge && (
                                  <img
                                    src={getBadgeImage(
                                      item?.session_info?.coachee_badge
                                    )}
                                    alt="Badge"
                                    style={{
                                      position: "absolute",
                                      right: "-10px",
                                      bottom: "10px",
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      background: "transparent",
                                      boxShadow: "unset",
                                    }}
                                  />
                                )}
                              </div>

                              <div style={{ marginLeft: "10px" }}>
                                <h6
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item?.session_info?.coachee_name}
                                </h6>
                                <div className="">
                                  <p style={{ fontSize: "10px" }}>
                                    {item?.session_info?.coaching_area_name}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p
                                style={{
                                  color: "#fff",
                                  padding: "2px",
                                  fontSize: "12px",
                                  textTransform: "capitalize",
                                  backgroundColor:
                                    item?.session_info?.session_details
                                      ?.status === "accepted"
                                      ? "#00B549" // accepted status color
                                      : item?.session_info?.session_details
                                          ?.status === "rejected"
                                      ? "#FF463A" // rejected status color
                                      : item?.session_info?.session_details
                                          ?.status === "completed"
                                      ? "#00B549" // complete status color
                                      : item?.session_info?.session_details
                                          ?.status === "paid"
                                      ? "#00B549" // paid status color
                                      : "#D8AA04", // default color

                                  fontWeight: "500",
                                  borderRadius: "8px",
                                }}
                              >
                                {item?.session_info?.session_details?.status}
                              </p>
                            </div>
                          </div>

                          <div className="">
                            <div className="d-flex justify-content-between flex-wrap">
                              <p> {t("Session length")} </p>
                              <p
                                style={{
                                  color: "#0F6D6A",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {item?.session_info?.session_details?.duration}{" "}
                                {t("mins")}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between flex-wrap">
                              <p> {t("Date/Time")} </p>
                              <p
                                style={{
                                  color: "#0F6D6A",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {format(
                                  new Date(
                                    item?.session_info?.session_details?.date
                                  ),
                                  "dd MMM, "
                                ) +
                                  item?.session_info?.session_details?.section}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* //////////////////////////// */}

            <div
              lg="6"
              md="6"
              xl="5"
              style={{
                minHeight: "100px",
                border: "2px solid #f8f8f8",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffff",
                padding: "10px",
                borderRadius: "25px",
              }}
              className="flex-grow-1 max-width"
            >
              <div className="d-flex justify-content-between">
                <h2
                  style={{
                    fontSize: "19px",
                    fontWeight: "600",
                    paddingBottom: "20px",
                    color: "#0F6D6A",
                  }}
                >
                  <Calendar size={18} /> {t("Upcoming Session")}
                </h2>
                <Button
                  style={{
                    height: "35px",
                    borderRadius: "25px",
                    // marginBottom: "20px",
                  }}
                  size="sm"
                  color="primary"
                  onClick={() => navigate("/coach/coaching")}
                >
                  {t("See All")}
                </Button>
              </div>
              <div className="">
                <div className="row">
                  {coming?.length === 0 && (
                    <p style={{ textAlign: "center" }}>
                      {t("No data available")}.
                    </p>
                  )}

                  {coming?.map((item) => (
                    <div
                      className="col-lg-6 mb-4"
                      style={{
                        cursor: "pointer",
                        marginBottom: "15px",
                      }} // Add margin here
                      onClick={() => {
                        setSelectedRequest(item), setRequestModal(true);
                      }}
                      key={item?.session_info?.id}
                    >
                      <Card
                        style={{
                          borderRadius: "15px",
                          height: "auto",
                        }}
                      >
                        <CardBody style={{ paddingLeft: "5px" }}>
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <Avatar
                                  img={
                                    item?.session_info?.coachee_profile_pic ||
                                    defaultAvatar
                                  }
                                  imgHeight="40"
                                  imgWidth="40"
                                />
                                {item?.session_info?.coachee_badge && (
                                  <img
                                    src={getBadgeImage(
                                      item?.session_info?.coachee_badge
                                    )}
                                    alt="Badge"
                                    style={{
                                      position: "absolute",
                                      right: "-10px",
                                      bottom: "10px",
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      background: "transparent",
                                      boxShadow: "unset",
                                    }}
                                  />
                                )}
                              </div>

                              <div style={{ marginLeft: "10px" }}>
                                <h6
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {item?.session_info?.coachee_name}
                                </h6>
                                <div className="">
                                  <p style={{ fontSize: "10px" }}>
                                    {item?.session_info?.coaching_area_name}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p
                                style={{
                                  color: "#fff",
                                  padding: "2px",
                                  fontSize: "12px",
                                  textTransform: "capitalize",
                                  backgroundColor:
                                    item?.session_info?.session_details
                                      ?.status === "accepted"
                                      ? "#00B549" // accepted status color
                                      : item?.session_info?.session_details
                                          ?.status === "rejected"
                                      ? "#FF463A" // rejected status color
                                      : item?.session_info?.session_details
                                          ?.status === "completed"
                                      ? "#00B549" // complete status color
                                      : item?.session_info?.session_details
                                          ?.status === "paid"
                                      ? "#00B549" // paid status color
                                      : "#D8AA04", // default color

                                  fontWeight: "500",
                                  borderRadius: "8px",
                                }}
                              >
                                {item?.session_info?.session_details?.status}
                              </p>
                            </div>
                          </div>

                          <div className="">
                            <div className="d-flex justify-content-between">
                              <p> {t("Session length")} </p>
                              <p
                                style={{
                                  color: "#0F6D6A",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {item?.session_info?.session_details?.duration}{" "}
                                {t("mins")}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between">
                              <p> {t("Date/Time")} </p>
                              <p
                                style={{
                                  color: "#0F6D6A",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                {format(
                                  new Date(
                                    item?.session_info?.session_details?.date
                                  ),
                                  "dd MMM, "
                                ) +
                                  item?.session_info?.session_details?.section}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              {/* </div> */}
              <SessionResponse
                requestModal={requestModal}
                setRequestModal={setRequestModal}
                data={selectedRequest}
                acceptedSessionError={acceptedSessionError}
                setAcceptedSessionError={setAcceptedSessionError}
                fetchData={fetchData}
              />
            </div>
          </div>
          {/* Additional Components like Modals, Alerts, etc., can go here */}
        </>
      )}

      {/* <div>
        <ReactPaginate
          previousLabel={''}
          nextLabel={''}
          breakLabel='...'
          pageCount={data?.totalPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={20}
          activeClassName='active'
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={(page) => handlePagination(page)}
          pageClassName='page-item'
          breakClassName='page-item'
          nextLinkClassName='page-link'
          pageLinkClassName='page-link'
          breakLinkClassName='page-link'
          previousLinkClassName='page-link'
          nextClassName='page-item next-item'
          previousClassName='page-item prev-item'
          containerClassName={
            'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
          }
        />
      </div> */}
    </div>
  );
};

export default Home;
