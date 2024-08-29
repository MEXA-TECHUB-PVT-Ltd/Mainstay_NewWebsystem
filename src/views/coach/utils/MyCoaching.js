import React, { useEffect, useState } from "react";
import { Card, Row } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useNavigate, useSearchParams } from "react-router-dom";
import SessionsFilter from "./SessionsFilter"; // Import the new component
import SessionCard from "./SessionCard"; // Import the new component
import SessionResponse from "../../../utility/SessionResponse";
import Loader from "../../../utility/Loader";
import { authGet, put } from "../../../urls/api";
import { ChevronLeft, ChevronRight } from "react-feather";
import { VideoRoom } from "../../callingSmaple/videoRoom";
import { toast } from "react-toastify";
import SessionEndModal from "../../../@core/layouts/components/menu/vertical-menu/SessionEndModal";
import { useTranslation } from "react-i18next";

const MyCoaching = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [requestModal, setRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [acceptedSessionError, setAcceptedSessionError] = useState("");

  //  ---
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  //  ---

  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const sessionCompleted = sessionStorage.getItem("sessionCompleted");
  const [isOpenSessionEndModal, setIsOpenSessionEndModal] = useState(
    sessionCompleted === "true" ? true : false
  );
  useEffect(() => {
    if (sessionCompleted === "true") {
      toast.success(t("Session is completed successfully!"), {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      sessionStorage.removeItem("sessionCompleted");
    }
  }, [sessionCompleted]);
  // const [selectedType, setSelectedType] = useState(status === "SESSION_REQUEST" ? "" : "paid");
  const [selectedType, setSelectedType] = useState(
    status === "SESSION_REQUEST"
      ? "pending,accepted,rejected"
      : status === "SESSION_REVIEW"
      ? "completed"
      : "paid"
  );

  const toggleSessionEndModal = () => {
    sessionStorage.removeItem("sessionCompleted");
    setIsOpenSessionEndModal(!isOpenSessionEndModal);
  };

  const types = [
    { value: "paid", label: t("Upcoming Sessions") },
    { value: "completed", label: t("Completed Sessions") },
    { value: "pending,accepted,rejected", label: t("Requested Sessions") },
  ];

  const fetchSessions = async () => {
    setLoading(true);
    let params = new URLSearchParams({
      page: currentPage,
      pageSize: 20,
      sort: sort,
      status: selectedType,
    });

    try {
      const response = await authGet(`session/get-by-coach?${params}`);
      if (response) {
        setData(response);
        setFilteredData(response.sessions);
        // If the server does not send currentPage, you can remove it from here.
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, [currentPage, selectedType, sort]);

  useEffect(() => {
    const filtered = data?.sessions?.filter((session) =>
      session?.session_info?.coachee_name
        ?.toLowerCase()
        ?.includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handleEndSession = (action) => {
    // setLoading(true);
    console.log("handle end session");
    // update the session as completed
    put(
      `session/status-update/${data?.session_info?.session_details?.session_id}`,
      {
        status: "completed",
      }
    ).then((res) => {
      console.log("Completed session");
      // setRequestModal(false);
      // setLoading(false);
    });
  };

  const handleLeaveSession = () => {
    localTracks.forEach((track) => {
      track.stop();
      track.close();
    });
    setUsers([]);
    setJoined(false);
    setVideoModalOpen(false);
    setRequestModal(false);
    handleEndSession();
    // ! refetch the data................................................................
  };

  return (
    <div>
      {loading && <Loader />}
      <h2 className="pb-2"> {t("My Coaching Sessions")} </h2>
      <SessionsFilter
        sort={sort}
        handleSort={(e) => setSort(e.target.value)}
        selectedType={selectedType}
        setSelectedType={(type) => {
          setSelectedType(type);
          setCurrentPage(1);
        }}
        types={types}
        setSearch={setSearch}
      />
      <Row className="justify-content-md-left">
        {filteredData?.length === 0 && (
          <p style={{ textAlign: "center" }}> {t("No data available")}</p>
        )}
        {filteredData?.map((item) => (
          <SessionCard
            key={item?.session_info?.id}
            item={item}
            onClick={() => {
              setSelectedRequest(item);
              setRequestModal(true);
            }}
          />
        ))}
      </Row>
      <ReactPaginate
        previousLabel={<ChevronLeft size={15} />}
        nextLabel={<ChevronRight size={15} />}
        breakLabel="..."
        pageCount={data?.totalPage || 0}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        activeClassName="active"
        forcePage={currentPage - 1}
        onPageChange={handlePagination}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-center"
        previousClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
      />

      <SessionResponse
        requestModal={requestModal}
        setRequestModal={setRequestModal}
        data={selectedRequest}
        acceptedSessionError={acceptedSessionError}
        setAcceptedSessionError={setAcceptedSessionError}
        fetchData={fetchSessions}
        joined={joined}
        setJoined={setJoined}
        videoLoading={videoLoading}
        setVideoModalOpen={setVideoModalOpen}
      />
      {sessionCompleted === "true" && (
        <SessionEndModal
          isOpen={isOpenSessionEndModal}
          toggle={toggleSessionEndModal}
        />
      )}
    </div>
  );
};

export default MyCoaching;
