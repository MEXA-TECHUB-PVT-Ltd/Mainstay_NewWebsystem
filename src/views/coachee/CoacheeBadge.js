import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "reactstrap";
import moment from "moment";
import { authGet } from "../../urls/api";
import BadgesComponent from "./components/BadgesComponent";
import SuccessModal from "./component/SuccessModal";
import { useTranslation } from "react-i18next";

const CoacheeBadge = () => {
  const { t } = useTranslation();
  const [coins, setCoins] = useState(0);
  const [coinsHistory, setCoinsHistory] = useState();
  const [badges, setBadges] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const getCoins = async () => {
    setIsLoading(true);
    try {
      const response = await authGet("rating/getCoacheeWellCoins");
      const newCoins = response?.overallTotalCoins;
      setCoins(newCoins);
      setCoinsHistory(response?.result);
      // Check coin totals for modal trigger
      console.log(newCoins);
      if (["30", "60", "100", "300"].includes(newCoins)) {
        setIsSuccessOpen(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadges = async () => {
    setIsLoading(true);
    try {
      const response = await authGet("rating/getCoacheeBadges");
      setBadges(response?.result?.name);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCoins();
    getBadges();
  }, []);

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h1 className="mb-2 text-primary"> {t("My Badges")} </h1>
      <Row>
        <Col lg={7} className="mb-4">
          <div className="profile-balance-card shadow">
            <div className="balance-top text-center py-3 bg-primary text-white">
              <h2 style={{ color: "#FFF" }}> {t("Total Coins")} </h2>
              <p style={{ fontSize: "24px", margin: "0" }}>{coins || 0}</p>
            </div>
            <div className="transaction-history p-3">
              <h3> {t("Welcoins History")} </h3>
              <div style={{ maxHeight: "450px", overflowY: "scroll" }}>
                {coinsHistory?.length === 0 && (
                  <p style={{ textAlign: "center" }}>
                    {" "}
                    {t("No data available")}{" "}
                  </p>
                )}
                {coinsHistory?.map((transaction, index) => (
                  <div
                    key={index}
                    className="transaction-item my-1 p-1 d-flex justify-content-between align-items-center gap-3"
                    style={{
                      borderBottom: "1px solid #0F6D6A",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={transaction?.coach_details?.profile_pic}
                        alt=""
                        width={80}
                        className=""
                      />
                      <div>
                        <p className="mb-0 ms-2" style={{ color: "#0F6D6A" }}>
                          {transaction?.coach_details?.first_name || ""}{" "}
                          {transaction?.coach_details?.last_name || ""}
                        </p>
                        <p className="mb-0 ms-2">
                          {transaction?.coaching_area_details?.name || ""}
                        </p>
                        <p className="mb-0 ms-2">
                          {moment(transaction?.accepted_at).format(
                            "MMMM Do YYYY"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-end" style={{ color: "#0F6D6A" }}>
                      10 {t("Wellcoins")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
        <Col lg={5}>
          <BadgesComponent userBadge={badges} />
        </Col>
      </Row>
      <SuccessModal
        isOpen={isSuccessOpen}
        toggle={handleCloseSuccess}
        title={t("Badge Received")}
        text={t("You have received a new Badge")}
      />
    </>
  );
};

export default CoacheeBadge;
