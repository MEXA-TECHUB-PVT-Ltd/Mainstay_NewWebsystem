import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "reactstrap";
import { authGet } from "../../urls/api";
import moment from "moment";
import WithdrawModal from "./components/profile/WithdrawModal";
import {
  useGetDurationQuery,
  useGetSectionByCoachQuery,
  useGetUserByRoleQuery,
} from "../../redux/dashboardApi";
import CoachProfileSection from "./components/profile/ProfileSection";
import InterestSection from "./components/profile/InterestSection";
import LanguageSection from "./components/profile/LanguageSection";
import AvailabilitySection from "./components/profile/AvailabilitySection";
import DurationSection from "./components/profile/DurationSection";
import DistributedBarChart from "../../charts/DistributedBarChart";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

const CoachProfile = () => {
  const { t } = useTranslation();
  const userData = JSON.parse(localStorage.getItem("loginUserData")) || [];
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState("00.00");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleToggleOpenModal = () => {
    setIsOpenModal(!isOpenModal);
  };
  const coachId = userData?.user?.id;
  const { data, refetch, isLoading } = useGetUserByRoleQuery({
    user_id: coachId,
    role: "coach",
  });

  const {
    data: availabilityData,
    isLoading: isLoadingAvailabilityData,
    refetch: refetchAvailabilityData,
  } = useGetSectionByCoachQuery({ id: coachId });

  const {
    data: durationData,
    isLoading: isLoadingDurationData,
    isError: isErrorDurationData,
  } = useGetDurationQuery({ id: coachId });

  const duration = durationData?.duration;

  console.log(availabilityData);

  const availabilities =
    availabilityData?.sections?.section_list?.[0]?.section_details;

  const user = data?.user;

  console.log(user);
  const fetchData = async () => {
    try {
      // setLoading(true);
      if (coachId) {
        const res = await authGet(`payments/get-user-transactions/${coachId}`);
        setTransactions(res?.result?.transactions);
        setWallet(res?.result?.wallet);
        // setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [coachId]);

  if (isLoading) {
    return <Spinner size="sm" />;
  }
  return (
    <>
      <h1 className="mb-1 text-primary"> {t("My Profile")} </h1>
      <Row>
        <Col lg={7} className="mb-2">
          <div className="profile-balance-card shadow-sm">
            <div
              className="balance-top text-center py-2"
              style={{ background: "#0F6D6A" }}
            >
              <h2 className="" style={{ color: "#FFF" }}>
                {t("Your Balance")}
              </h2>
              <p
                className=""
                style={{ fontSize: "24px", margin: "0", color: "#FFF" }}
              >
                CHF {wallet?.balance || 0.0}
              </p>
              <Button
                className="mt-1"
                color=""
                style={{
                  backgroundColor: "#FFF",
                  color: "#0F6D6A",
                }}
                onClick={handleToggleOpenModal}
              >
                {t("Withdraw")}
              </Button>
            </div>
            <div className="transaction-history p-3">
              <h3>{t("Transaction History")}</h3>
              <div style={{ maxHeight: "510px", overflowY: "scroll" }}>
                {transactions?.map((transaction, index) => (
                  <div
                    key={index}
                    className="transaction-item d-flex justify-content-between align-items-center my-2 p-2"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      display: "flex",
                    }}
                  >
                    <div
                      className="transaction-amount"
                      style={{ flex: 1, fontWeight: "bold" }}
                    >
                      CHF-{transaction?.amount || "0.00"}
                    </div>
                    <div
                      className="transaction-status"
                      style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {transaction?.out_going ? (
                        <span style={{ color: "#dc3545" }}>
                          🔴 {t("debit")}
                        </span>
                      ) : (
                        <span style={{ color: "#28a745" }}>
                          🟢 {t("credit")}{" "}
                        </span>
                      )}
                    </div>
                    <div
                      className="transaction-date"
                      style={{ flex: 2, textAlign: "right" }}
                    >
                      {moment(transaction?.created_at).format(
                        "MMMM Do YYYY, HH:mm:ss"
                      ) || t("Date Unknown")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
        <Col lg={5}>
          <Card className="profile-details-card px-2 py-1 shadow-sm">
            <CoachProfileSection user={user} refetch={refetch} />
            <InterestSection user={user} refetch={refetch} />
            <LanguageSection user={user} refetch={refetch} />
            <AvailabilitySection
              availabilities={availabilities}
              refetch={refetchAvailabilityData}
            />
            <DurationSection duration={duration} refetch={refetch} />
          </Card>
          <DistributedBarChart coachId={coachId} />
        </Col>
      </Row>

      <WithdrawModal
        handleToggle={handleToggleOpenModal}
        isOpen={isOpenModal}
        coachId={coachId}
        refetch={fetchData}
      />
      {/* <ToastContainer /> */}
    </>
  );
};

export default CoachProfile;
