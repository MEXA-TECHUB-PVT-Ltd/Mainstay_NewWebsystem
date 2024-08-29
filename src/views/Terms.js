import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import terms from "../@core/assets/images/logo/terms.png";
import { useGetPolicesQuery } from "../redux/dashboardApi";
import { convertFromRaw } from "draft-js";
import { toast } from "react-toastify";
import { ContentState, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation();
  const {
    data,
    isLoading: isPrivacyLoading,
    error,
  } = useGetPolicesQuery("terms");

  const [policyContent, setPolicyContent] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(t("Failed to load policy data."));
      console.error("Error fetching policy:", error);
    } else if (data && data.policy && data.policy.content) {
      console.log("Received data:", data.policy.content);
      const rawData = JSON.parse(data.policy.content);
      if (rawData && rawData.blocks && rawData.entityMap !== undefined) {
        const contentFromBackend = convertFromRaw(rawData);
        const htmlContent = stateToHTML(contentFromBackend);
        setPolicyContent(htmlContent);
      } else {
        console.error("Invalid data structure:", rawData);
      }
    }
  }, [data, error]);

  return (
    <Card style={{ margin: "20px" }}>
      <CardHeader>
        <div
          className="d-flex flex-wrap justify-content-between align-items-center w-full"
          style={{ width: "100%" }}
        >
          <div
          // className="flex-grow-1"
          // style={{
          //   maxWidth: "900px",
          // }}
          >
            <h1> {t("Terms & Conditions")} </h1>
          </div>

          <img
            className="flex-grow-1"
            src={terms}
            alt="Privacy"
            style={{
              minWith: "100px",
              maxWidth: "200px",
            }}
          />
        </div>
      </CardHeader>
      <CardBody>
        {isPrivacyLoading ? (
          <p> {t("Loading policy...")} </p>
        ) : policyContent ? (
          <div dangerouslySetInnerHTML={{ __html: policyContent }} />
        ) : (
          <p> {t("No terms policy available")} </p>
        )}
      </CardBody>
    </Card>
  );
};

export default Terms;
