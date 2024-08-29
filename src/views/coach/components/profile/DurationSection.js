import React, { useState } from "react";
import { Button } from "reactstrap";
import DurationModal from "../modals/DurationModal";
import CommonSectionDiv, { HeaderText, MyButton } from "./CommonSectionDiv";
import durationImage from "../../../../@core/assets/images/logo/duration.png";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const DurationSection = ({ duration, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const toggleModal = () => [setIsModalOpen(!isModalOpen)];
  return (
    <>
      <CommonSectionDiv>
        <div className="d-flex align-items-center">
          <img src={durationImage} alt="No image" width={30} className="me-1" />

          <HeaderText text={t("Duration")} />
        </div>
        <MyButton text={t("Edit")} toggleModal={toggleModal} />
      </CommonSectionDiv>
      <DurationModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        duration={duration}
        refetch={refetch}
      />
    </>
  );
};

export default DurationSection;
