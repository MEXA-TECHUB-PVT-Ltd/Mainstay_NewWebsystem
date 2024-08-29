import React from "react";
import { Button, Card, CardBody, CardHeader, Spinner } from "reactstrap";
import IOSToggleButton from "../../utility/IOSToggleButton";
import {
  useGetUserByRoleQuery,
  useGetUserInterestQuery,
} from "../../redux/dashboardApi";
import NotificationSettings from "./components/profile/NotificationSettings";
import ProfileSection from "./components/profile/ProfileSection";
import AreaOfInterest from "./components/profile/AreaOfInterest";
import { ToastContainer } from "react-toastify";

const CoacheeProfileSetting = () => {
  const userData = JSON.parse(localStorage.getItem("loginUserData")) || [];
  const userId = userData?.user?.id || userData?.id;

  const { data, refetch, isLoading } = useGetUserByRoleQuery({
    user_id: userId,
    role: "coachee",
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="my-4">
      <div className="row">
        <div className="col-lg-6 mb-4">
          <ProfileSection user={data?.user} refetch={refetch} />
        </div>
        <div className="col-lg-6 mb-4">
          {/* <NotificationSettings /> */}
          <AreaOfInterest
            interests={data?.user?.interests}
            refetch={refetch}
          />
        </div>
        <div className="col-lg-6 mb-4">
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default CoacheeProfileSetting;
