import { useEffect, useState } from "react";
import { Card, CardBody, Spinner } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import Loader from "../../utility/Loader";
import { Star } from "react-feather";

import "./css/request.css";
import {
  useGetAllByAreaQuery,
  useGetSessionByCoacheeQuery,
} from "../../redux/dashboardApi";
import SessionsFilter from "../coach/utils/SessionsFilter";
import { getBadgeImage } from "../../utility/badges";
import { useTranslation } from "react-i18next";

const Request = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [value, setValue] = useState();
  const [sort, setSort] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState();
  const [filteredData, setFilteredData] = useState([]);

  let data = [];
  let loading;

  const [selectedType, setSelectedType] = useState("paid");
  const types = [
    { value: "paid", label: t("Upcoming Sessions") },
    { value: "completed", label: t("Completed Sessions") },
    { value: "pending,accepted,rejected", label: t("Requested Sessions") },
  ];
  if (selectedType) {
    const {
      data: d,
      isLoading: sessionLoading,
      isError,
    } = useGetSessionByCoacheeQuery({
      selectedType,
      sort,
      page: currentPage,
      pageSize: 24,
    });
    data = d;
    loading = sessionLoading;
  } else {
    const { data: d, isLoading, isError } = useGetSessionByCoacheeQuery();
    data = d;
  }

  const { data: coachingAreas, isLoading, isError } = useGetAllByAreaQuery();
  const coachingArea = coachingAreas;
  const handleClick = (coach_id, id) => {
    navigate(`/coachee/coach-detail/${coach_id}?session=${id}`);
  };
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  useEffect(() => {
    const filtered = data?.sessions?.filter((session) =>
      search
        ? session?.session_info?.coach_name
            .toLowerCase()
            .includes(search.toLowerCase())
        : true
    );
    setFilteredData(filtered);
  }, [search, data]);

  return (
    <>
      <h2 className="pb-2"> {t("My Coaching")} </h2>
      <SessionsFilter
        sort={sort}
        handleSort={(e) => setSort(e.target.value)}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        types={types}
        setSearch={setSearch}
      />

      {loading && <Spinner />}
      <div className="row justify-content-md-left">
        {filteredData?.length === 0 ? (
          <div className="col-12 text-center">
            <p>{t("There is no data yet to display")}</p>
          </div>
        ) : (
          filteredData?.map((item) => (
            <div
              key={item?.session_info?.session_details?.session_id}
              className="col-lg-2 col-md-4 col-sm-12"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleClick(
                  item?.session_info?.coach_id,
                  item?.session_info?.session_details?.session_id
                )
              }
            >
              {loading && <Loader />}
              <Card
                style={{
                  borderRadius: "15px",
                  // height: "250px",
                  // width: "230px",
                  // margin: "0 auto", // Center the card in its column
                }}
              >
                <div
                  style={{
                    backgroundColor: "#0F6D6A",
                    paddingRight: "9px",
                    width: "50px",
                    height: "25px",
                    borderRadius: "10px",
                    position: "absolute",
                    top: "5px",
                    left: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center", // Horizontally center the content
                  }}
                >
                  <Star
                    size={20}
                    style={{
                      color: "gold",
                      margin: "5px",
                    }}
                  />
                  <p
                    style={{
                      color: "#fff",
                      marginTop: "15px",
                      fontSize: "14px",
                    }}
                  >
                    {parseInt(item?.session_info?.coach_avg_rating) || 0}
                  </p>
                </div>

                <p
                  style={{
                    color: "#fff",
                    padding: "2px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                    backgroundColor:
                      item?.session_info?.session_details?.status === "accepted"
                        ? "#00B549" // accepted status color
                        : item?.session_info?.session_details?.status ===
                          "rejected"
                        ? "#FF463A" // rejected status color
                        : item?.session_info?.session_details?.status ===
                          "completed"
                        ? "#00B549" // complete status color
                        : item?.session_info?.session_details?.status === "paid"
                        ? "#00B549" // paid status color
                        : "#D8AA04", // default color
                    fontWeight: "500",
                    borderRadius: "8px",
                    position: "absolute",
                    top: "5px",
                    right: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center", // Horizontally center the content
                  }}
                >
                  {t(item?.session_info?.session_details?.status)}
                </p>

                <img
                  alt="Sample"
                  src={item?.session_info?.coach_profile_pic || defaultAvatar}
                  style={{
                    aspectRatio: "1/1",
                    height: "120px", // Allow the height to adjust based on the width
                    width: "auto", // Ensure the image fills its container horizontally
                    objectFit: "contain", // Maintain aspect ratio and cover the container
                    display: "block", // Ensure the image is a block element to center it horizontally
                    // marginLeft: "auto",
                    // marginRight: "auto",
                  }}
                />
                <CardBody style={{}}>
                  <div className="d-flex align-items-center gap-2">
                    <h6 style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {item?.session_info?.coach_name}
                    </h6>
                    {item?.session_info?.coach_badge !== "NULL" &&
                      item?.session_info?.coach_badge !== null && (
                        <img
                          src={getBadgeImage(item?.session_info?.coach_badge)}
                          alt=""
                          width={20}
                          height={20}
                        />
                      )}
                  </div>
                  <div className="">
                    <p style={{ fontSize: "10px" }}>
                      {item?.session_info?.coaching_area_name}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))
        )}
      </div>

      <div className="d-flex justify-content-center mb-3">
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          breakLabel="..."
          pageCount={data?.totalPage}
          marginPagesDisplayed={2}
          pageRangeDisplayed={20}
          activeClassName="active"
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={(page) => handlePagination(page)}
          pageClassName="page-item"
          breakClassName="page-item"
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextClassName="page-item next-item"
          previousClassName="page-item prev-item"
          containerClassName={
            "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
          }
        />
      </div>
    </>
  );
};

export default Request;
