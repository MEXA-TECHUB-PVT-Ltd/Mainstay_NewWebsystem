import React, { useState } from "react";
import { Button } from "reactstrap";
import AvailabilityModal from "../modals/AvailabilityModal";
import CommonSectionDiv, { HeaderText, MyButton } from "./CommonSectionDiv";
import avail from "../../../../@core/assets/images/logo/avail.png";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const AvailabilitySection = ({ availabilities, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const toggleModal = () => [setIsModalOpen(!isModalOpen)];
  return (
    <>
      <CommonSectionDiv>
        <div className="d-flex align-items-center">
          <img src={avail} alt="No image" width={30} className="me-1" />
          <HeaderText text={t("My Availability")} />
        </div>
        <MyButton text={t("Edit")} toggleModal={toggleModal} />
      </CommonSectionDiv>
      <AvailabilityModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        availabilities={availabilities}
        refetch={refetch}
      />
    </>
  );
};

export default AvailabilitySection;
