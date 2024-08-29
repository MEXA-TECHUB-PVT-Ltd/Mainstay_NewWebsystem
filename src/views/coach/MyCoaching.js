import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  CardSubtitle,
  Button,
  Label,
  Input,
  FormGroup,
  Badge,
  Row,
  Col,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import Avatar from "@components/avatar";
import { format } from "date-fns";

import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { authGet, get } from "../../urls/api";
import SessionResponse from "../../utility/SessionResponse";
import Loader from "../../utility/Loader";
import { Search } from "react-feather";
import { useTranslation } from "react-i18next";

const MyCoaching = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [requestModal, setRequestModal] = useState(false);
  const [value, setValue] = useState();
  const [sort, setSort] = useState();
  const [acceptedSessionError, setAcceptedSessionError] = useState("");

  const [type, setType] = useState([
    { value: "paid", label: "Upcoming Sessions" },
    { value: "completed", label: "Completed Sessions" },
    { value: "", label: "Requested Sessions " },
  ]);
  const [selectedRequest, setSelectedRequest] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [coachingArea, setCoachingArea] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    authGet(
      `session/get-by-coach?status=${selectedType}&sort=${sort}&pageSize=20`
    ).then((res) => {
      setData(res.session);
      setLoading(false);
    });
  }, [selectedType, sort]);

  useEffect(() => {
    console.log(selectedType);
    const baseUrl = "session/get-by-coach?";
    let params = new URLSearchParams({
      pageSize: 12,
      sort: sort,
      page: currentPage,
    });

    // Only add status if selectedType is not empty
    if (selectedType) {
      console.log(selectedType);
      params.append("status", selectedType);
    }

    // Only add searchTerm if search is not empty
    if (search) {
      params.append("searchTerm", search);
    }

    const finalUrl = baseUrl + params.toString();

    setTimeout(
      authGet(finalUrl).then((res) => {
        // console.log(res);
        setCurrentPage(res?.currentPage || 1);
        setData(res?.sessions);
        setLoading(false);
      }),
      1000
    );
  }, [selectedType]);
  const handleClick = (id) => {
    navigate(`/coach-detail/${id}`);
  };
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleChange = (e) => {
    setType(e.target.value);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
  };

  return (
    <div className="container">
      {loading && <Loader />}
      <h2 className="pb-2"> {t("Discover")} </h2>
      <div className="d-flex">
        {" "}
        <div
          className="d-flex mb-4 "
          style={{
            backgroundColor: "#ffff",
            marginRight: "20px",
            height: "40px",
            width: "70%",
          }}
        >
          <FormGroup
            className="col-lg-2 d-flex"
            style={{
              borderRadius: "10px",
              marginBottom: "0",
              padding: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              height: "fit-content", // Adjust height as needed
            }}
          >
            <Label
              style={{
                width: "100%",
                alignSelf: "center",
                textAlignLast: "center",
                marginBottom: "0",
                fontWeight: "800",
                fontSize: "15px",
              }}
              for="exampleSelect"
            >
              {t("Sort By")}:
            </Label>
            <Input
              style={{
                border: "none",
                background: "transparent",
                fontSize: "14px", // Adjust input font size
              }}
              type="select"
              name="select"
              id="exampleSelect"
              value={sort}
              onChange={handleSort}
            >
              <option value="created_at_desc">{t("Newest")}</option>
              <option value="created_at_asc">{t("Oldest")}</option>
              <option value="first_name_asc"> {t("A To Z")} </option>
              <option value="first_name_desc"> {t("Z To A")} </option>
            </Input>
          </FormGroup>

          <div className="d-flex col-lg-8 col-lg-6 col-sm-12 ">
            {type.map((item) => (
              <Button
                className="w-25"
                block
                onClick={() =>
                  setSelectedType(selectedType === item.value ? "" : item.value)
                }
                style={{
                  marginLeft: "10px",
                  borderRadius: "15px",
                  backgroundColor: "#C8D0D0",
                }}
                color={selectedType === item.value ? "primary" : "#C8D0D0"}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        <InputGroup
          style={{ height: "20px", borderRadius: "35px", width: "25%" }}
        >
          <InputGroupText
            addonType="prepend"
            style={{
              borderTopLeftRadius: "35px",
              borderBottomLeftRadius: "35px",
              borderRight: "none",
            }}
          >
            <Search />
          </InputGroupText>
          <Input
            onChange={(e) => setSearch(e.target.value)}
            style={{
              borderTopRightRadius: "35px",
              borderBottomRightRadius: "35px",
              borderLeft: "none",
            }}
            placeholder={t("Search...")}
          />
        </InputGroup>
      </div>

      <div className="row justify-content-md-left">
        {data?.map((item) => (
          <Col
            lg={3}
            md={4}
            xs={12}
            key={item?.session_info?.id}
            className=" mb-4"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedRequest(item), setRequestModal(true);
            }}
          >
            <Card
              style={{
                borderRadius: "15px",
                // height: "150px",
                // width: "220px",
                // margin: "0px",
              }}
            >
              <CardBody style={{ paddingLeft: "5px" }}>
                <div className="d-flex ">
                  <div>
                    <Avatar
                      img={
                        item?.session_info?.coachee_profile_pic || defaultAvatar
                      }
                      imgHeight="40"
                      imgWidth="40"
                      // status="online"
                    />
                  </div>

                  <div style={{ marginLeft: "10px" }}>
                    {" "}
                    <h6 style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {item?.session_info?.coachee_name}
                    </h6>
                    <div className="">
                      <p style={{ fontSize: "10px" }}>
                        {item?.session_info?.coaching_area_name}
                      </p>
                    </div>
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
                      {item?.session_info?.session_details?.duration} mins
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
                        new Date(item?.session_info?.session_details?.date),
                        "dd:MM, "
                      ) + item?.session_info?.session_details?.section}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </div>
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

      <SessionResponse
        requestModal={requestModal}
        setRequestModal={setRequestModal}
        data={selectedRequest}
        acceptedSessionError={acceptedSessionError}
        setAcceptedSessionError={setAcceptedSessionError}
      />
    </div>
  );
};

export default MyCoaching;
