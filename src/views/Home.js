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
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { get } from "../urls/api";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Loader from "../utility/Loader";
import { ChevronLeft, ChevronRight, Search, Star } from "react-feather";
import {
  useGetAllByAreaQuery,
  useGetAllByCategoryQuery,
  useGetAllCoachQuery,
} from "../redux/dashboardApi";

import "./css/home.css";
import { getBadgeImage } from "../utility/badges";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lng } = useSelector((s) => s.languageSlice);

  const [value, setValue] = useState();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("created_at_desc");
  const [loading, setLoading] = useState(false);
  const {
    data: coachesData,
    isLoading: isLoadingCoaches,
    isError: isErrorCoaches,
  } = useGetAllCoachQuery(
    { page: currentPage, sortColumn: sort, search: search ? search : "" },
    { skip: !!type }
  );

  const {
    data: categoryData,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    isFetching,
    error: categoryError,
  } = useGetAllByCategoryQuery(
    { type, pageSize: 24, sort, currentPage },
    { skip: !type }
  );

  const {
    data: coachingArea,
    isLoading: isLoadingCoachingArea,
    isError: isErrorCoachingArea,
  } = useGetAllByAreaQuery();

  console.log("coachingArea", coachingArea);

  if (categoryError?.status === 401) {
    localStorage.removeItem("userData");
    localStorage.removeItem("loginUserData");
    window.location = "/login?user=coachee";
  }
  // Here you would use coachesData or categoryData depending on the condition `type`
  const data = type ? categoryData : coachesData;
  const isLoading = type ? isLoadingCategory : isLoadingCoaches;
  const isError = type ? isErrorCategory : isErrorCoaches;

  if (isError) {
    return <div>Error occurred!</div>;
  }

  const handleClick = (id) => {
    navigate(`/coachee/coach-detail/${id}`);
  };
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };
  const handleChange = (e) => {
    setType(e.target.value);
  };

  const handleChangeSort = (e) => {
    console.log("Current sort:", sort, "New sort:", e.target.value);
    setSort(e.target.value);
  };

  return (
    <>
      <div className="" key={sort}>
        <h2 className="pb-2"> {t("Discover")} </h2>
        <div className="container-fluid">
          <div className="row justify-content-between">
            <div className="col-lg-2 col-md-2 col-lg-3">
              <div
                className=""
                style={{
                  backgroundColor: "#F8F8FF",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FormGroup
                  className="d-flex m-0 margin-force-zero"
                  style={{
                    borderRadius: "10px",
                    margin: "0 !important",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    height: "fit-content",
                  }}
                >
                  <Label
                    for="exampleSelect"
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      textAlignLast: "center",
                      marginBottom: "0 !important",
                      fontWeight: "800",
                      fontSize: "15px",
                    }}
                  >
                    {t("Sort By")}:
                  </Label>
                  <Input
                    type="select"
                    name="select"
                    id="exampleSelect"
                    value={sort}
                    onChange={handleChangeSort}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "14px",
                    }}
                  >
                    <option value="created_at_desc">{t("Newest")}</option>
                    <option value="created_at_asc">{t("Oldest")}</option>
                    <option value="first_name_asc">{t("A To Z")}</option>
                    <option value="first_name_desc">{t("Z To A")}</option>
                    <option value="rating">{t("Top Rating")}</option>
                  </Input>
                </FormGroup>
              </div>
            </div>
            <div className="col-lg-6 col-md-5">
              <div
                className=""
                style={{
                  backgroundColor: "#F8F8FF",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  maxWidth: "350px",
                }}
              >
                <FormGroup className="d-flex">
                  <Label
                    for="categorySelect"
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      textAlignLast: "center",
                      fontWeight: "800",
                      fontSize: "15px",
                    }}
                  >
                    {t("Categories")}
                  </Label>
                  <Input
                    type="select"
                    name="select"
                    id="categorySelect"
                    value={value}
                    onChange={handleChange}
                    style={{ border: "none", width: "100%", cursor: "pointer" }}
                  >
                    <option value="all"> {t("All Categories")} </option>

                    {coachingArea?.result?.map((area) => (
                      <option key={area?.id} value={area?.id}>
                        {lng === "ge" ? area?.german_name : area?.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-4 d-flex justify-content-lg-end justify-content-start">
              {isLoadingCategory && <Loader />}
              {isFetching && <Loader />}
              <InputGroup
                style={{
                  height: "40px",
                  borderRadius: "35px",
                  width: "100%",
                  maxWidth: "500px",
                }}
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("Search...")}
                  style={{
                    borderTopRightRadius: "35px",
                    borderBottomRightRadius: "35px",
                    borderLeft: "none",
                  }}
                />
              </InputGroup>
            </div>
          </div>
        </div>

        <div className="row justify-content-md-left">
          {data?.data
            ?.filter((item) => {
              const fullName =
                `${item?.first_name} ${item?.last_name}`.toLowerCase();
              return fullName?.includes(search.toLowerCase());
            })
            .map((item) => (
              <div
                key={item?.user_id}
                className="col-lg-2 mb-4"
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => handleClick(item?.user_id)}
              >
                <Card
                  style={{
                    borderRadius: "15px",
                    height: "250px",
                  }}
                  className="ml-4 mr-4"
                >
                  <div
                    style={{
                      backgroundColor: "#0F6D6A",
                      paddingRight: "9px",
                      width: "50px",
                      height: "25px",
                      borderRadius: "8px",
                      position: "absolute",
                      top: "5px",
                      left: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center", // Horizontally center the content
                    }}
                  >
                    <Star
                      size={16}
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
                      {parseInt(item?.avg_rating) || 0}
                    </p>
                  </div>

                  {/* Position the star icon */}
                  <img
                    alt="Sample"
                    className="smallIcon"
                    src={item.profile_pic}
                    style={{
                      aspectRatio: "1/1",
                      height: "120px",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                  {item?.badge_name !== "NULL" && item?.badge_name !== null && (
                    <img
                      src={getBadgeImage(item?.badge_name)}
                      alt=""
                      width={20}
                      height={20}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "8px",
                      }}
                    />
                  )}
                  <CardBody style={{ paddingLeft: "5px" }}>
                    <div className="d-flex gap-2">
                      <h6 style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {item.first_name + " " + item.last_name}
                      </h6>
                    </div>
                    <div className="">
                      <p style={{ fontSize: "10px" }}>
                        {item?.coaching_areas?.map(
                          (int) => int.german_name + "-"
                        )}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
        </div>
        {data?.data.filter((item) => {
          // Filter based on the search term
          const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
          return fullName.includes(search.toLowerCase());
        }).length === 0 && (
          <div className="text-center">
            <p> {t("No results found")} </p>
          </div>
        )}
        <div className="d-flex justify-content-center mb-3">
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
        </div>
      </div>
    </>
  );
};

export default Home;
