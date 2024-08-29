// ** Dropdowns Imports
import { Bell } from "react-feather";
import UserDropdown from "./UserDropdown";
import NotificationIcon from "../../../../utility/NotificationIcon";
import { Badge } from "reactstrap";
import { BASE_URL, authGet } from "../../../../urls/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NavbarUser = () => {
  const [coins, setCoins] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const getCoins = async () => {
    try {
      const response = await authGet("rating/getCoacheeWellCoins");
      setCoins(response?.overallTotalCoins);
    } catch (error) {
      console.log(error);
    }
  };

  const userData =
    JSON.parse(localStorage.getItem("loginUserData")) || undefined;

  const role = userData?.user ? userData?.user?.role : userData?.role;
  const userId = userData?.user ? userData?.user?.id : userData?.id;

  useEffect(() => {
    getCoins();
  }, []);

  async function checkUnReadNotifications() {
    let response;
    if (role === "coach") {
      response = await fetch(
        `${BASE_URL}notifications/getCount?coachId=${userId}`
      );
    }

    if (role === "coachee") {
      response = await fetch(
        `${BASE_URL}notifications/getCount?coacheeId=${userId}`
      );
    }
    const notification = await response.json();
    console.log(notification?.count);
    setNotificationCount(notification?.count);
  }

  useEffect(() => {
    const unreadNotification = setInterval(checkUnReadNotifications, 20000);

    return () => {
      clearInterval(unreadNotification);
    };
  }, []);

  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      {role && role === "coachee" && (
        <Badge
          color="primary"
          pill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center text horizontally
            width: "70px",
            margin: "0 25px", // Increase spacing on both sides
          }}
        >
          <img
            src="/icons/star.png" // Replace with the actual path to your coin icon
            alt="Coin Icon"
            style={{ width: "auto", height: "25px", marginRight: "5px" }}
          />
          <h5
            className="text-center align-center"
            style={{ color: "#fff", margin: "0" }}
          >
            {coins || 0}
          </h5>
        </Badge>
      )}

      <div
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => navigate("/coachee/notifications")}
      >
        <NotificationIcon />
        {notificationCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              left: "10px",
              height: "8px",
              width: "8px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          ></span>
        )}
      </div>

      <UserDropdown />
    </ul>
  );
};

export default NavbarUser;
