import React, { useState } from "react";
import LoadingCircle from "../../utility/LoadingCircle";
import { useTranslation } from "react-i18next";

const FinalScreen = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const containerStyle = {
    background: 'url("/img/complete-background.png") center/cover no-repeat',
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  setTimeout(() => setShow(true), 1000);
  return (
    <div style={containerStyle}>
      <div>
        <div style={{ textAlign: "-webkit-center", margin: "50px" }}>
          {show && <LoadingCircle url={"/coachee/home"} process={100} />}
        </div>
        <div style={{ textAlign: "-webkit-center" }}>
          <h2
            className="text-center"
            style={{ color: "#FFFFFF", fontSize: "30px", width: "50%" }}
          >
            {t("Generating best coaches screen")}
          </h2>
          <p className="text-center" style={{ color: "#FFFFFF", width: "60%" }}>
            {t(
              "Our mission is to match you with exceptional coaches who will inspire, guide, and empower you on your path to success"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
export default FinalScreen;
