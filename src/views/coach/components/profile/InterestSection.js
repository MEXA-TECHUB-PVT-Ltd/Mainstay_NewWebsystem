import React, { useState } from "react";
import { Button } from "reactstrap";
import InterestModal from "../modals/InterestModal";
import CommonSectionDiv, { HeaderText, MyButton } from "./CommonSectionDiv";
import interest from "../../../../@core/assets/images/logo/interest.png";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const InterestSection = ({ user, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { lng } = useSelector((state) => state.languageSlice);

  const toggleModal = () => [setIsModalOpen(!isModalOpen)];
  return (
    <>
      <CommonSectionDiv>
        <div>
          <div className="d-flex align-items-center">
            <img src={interest} alt="No image" width={30} className="me-1" />
            <div>
              <HeaderText text={t("Coaching Area")} />
              {user?.coaching_areas?.map((value, index) => (
                <span key={index} style={{ color: "#fff" }}>
                  {lng === "ge"
                    ? value?.german_name + ", "
                    : value?.name + ", "}
                </span>
              ))}
            </div>
          </div>
        </div>
        <MyButton text={t("Edit")} toggleModal={toggleModal} />
      </CommonSectionDiv>
      <InterestModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        user={user}
        refetch={refetch}
      />
    </>
  );
};

export default InterestSection;
