import { Button, Card, CardBody } from "reactstrap";
import IOSToggleButton from "../../../../utility/IOSToggleButton";
import Interest from "../modals/Interest";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const AreaOfInterest = ({ interests, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { lng } = useSelector((state) => state.languageSlice);

  const toggleModal = () => [setIsModalOpen(!isModalOpen)];
  return (
    <>
      <Card style={{ display: "flex", flexDirection: "column" }}>
        <div className="py-2 px-2">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h4 className="mb-0" style={{ color: "#0F6D6A" }}>
              {t("Area Of Interest")}
            </h4>
            <Button
              color="primary"
              style={{
                borderRadius: "50px",
                boxShadow: "none",
              }}
              onClick={toggleModal}
            >
              {t("Edit")}
            </Button>
          </div>
        </div>
        <CardBody>
          <div className="row">
            <div className="col">
              {interests?.map((row, index) => (
                <div key={index}>
                  <h6 className="my-1">
                    {lng === "ge" ? row.german_name : row.name}
                  </h6>
                </div>
              ))}
            </div>
            <div className="col" style={{ textAlign: "right" }}>
              {/* {Array.from({ length: interests?.length }).map((index) => (
                <div key={index}>
                  <IOSToggleButton
                  // defaultChecked={}
                  // handleChange={}
                  />
                </div>
              ))} */}
            </div>
          </div>
        </CardBody>
      </Card>
      <Interest
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        refetch={refetch}
        interests={interests}
      />
    </>
  );
};

export default AreaOfInterest;
