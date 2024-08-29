import React, { useState } from "react";
import { Button } from "reactstrap";
import LanguageModal from "../modals/LanguageModal";
import CommonSectionDiv, { HeaderText, MyButton } from "./CommonSectionDiv";
import lang from "../../../../@core/assets/images/logo/lang.png";
import { useTranslation } from "react-i18next";

const LanguageSection = ({ user, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const toggleModal = () => [setIsModalOpen(!isModalOpen)];
  return (
    <>
      <CommonSectionDiv>
        <div>
          <div className="d-flex align-items-center">
            <img src={lang} alt="No image" width={30} className="me-1" />
            <div>
              <HeaderText text={t("Languages")} />
              {user?.languages?.map((value, index) => (
                <span key={index} style={{ color: "#fff" }}>
                  {value},{" "}
                </span>
              ))}
            </div>
          </div>
        </div>
        <MyButton text={t("Edit")} toggleModal={toggleModal} />
      </CommonSectionDiv>
      <LanguageModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        user={user}
        refetch={refetch}
      />
    </>
  );
};

export default LanguageSection;
