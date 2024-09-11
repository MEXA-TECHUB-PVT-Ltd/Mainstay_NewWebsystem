import { Button, Card, CardBody } from "reactstrap";
import UpdateProfile from "../modals/UpdateProfile";
import { useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

const ProfileSection = ({ user, refetch }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => [setIsModalOpen(!isModalOpen)];

  return (
    <>
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <div className="py-2 px-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div
              className="d-flex align-items-center gap-1 flex-wrap"
              style={{ flex: 1 }}
            >
              <img
                src={user?.profile_pic}
                alt="Profile Image"
                style={{ width: "60px", height: "60px", borderRadius: "30px" }}
              />
              <div>
                <h5 className="mb-0">
                  {user?.first_name + " " + user?.last_name}
                </h5>
                <p className="mb-0 text-muted">{user?.email}</p>
              </div>
            </div>
            <div>
              <Button
                color="primary"
                style={{
                  borderRadius: "50px",
                  boxShadow: "none",
                }}
                onClick={toggleModal}
              >
                {t("Edit Profile")}
              </Button>
            </div>
          </div>
        </div>
        <CardBody>
          <div className="row">
            <div className="col">
              <h6 className="my-1"> {t("Date of Birth")} </h6>
              <h6 className="my-1"> {t("Phone Number")} </h6>
              <h6 className="my-1"> {t("Country")} </h6>
            </div>
            <div className="col" style={{ textAlign: "right" }}>
              <p>{moment(user?.date_of_birth).format("DD/MM/YYYY")}</p>
              <p>{user?.phone}</p>
              <p>{user?.country_name}</p>
            </div>
          </div>
        </CardBody>
      </Card>
      <UpdateProfile
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        user={user}
        refetch={refetch}
      />
    </>
  );
};

export default ProfileSection;
