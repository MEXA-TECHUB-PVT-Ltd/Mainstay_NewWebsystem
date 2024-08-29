import React, { useEffect, useState } from "react";
import LoadingCircle from "../../utility/LoadingCircle";
import { useSearchParams } from "react-router-dom";
import { authGet, authPost, put } from "../../urls/api";

const FinalScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  const [isVerificationCompleted, setIsVerificationCompleted] = useState(false);

  const params = searchParams.get("stripe_account");
  const id = searchParams.get("account_id");
  const updateCompleted = async () => {
    const status = await put("coach/update", { is_stripe_completed: true });
    setIsVerificationCompleted(true);
  };

  const checkStripeStatus = async (accountId) => {
    // Check if accountId is provided
    if (!id) {
      console.log("No Stripe account ID provided, creating account link...");
      setLoading(true);
      const accountCreatedResult = await authPost(
        "payments/create-account-link"
      );
      if (accountCreatedResult?.result?.url) {
        window.location.href = accountCreatedResult.result.url;
        return; // Exit the function to prevent further execution
      } else {
        console.error("Failed to create Stripe account link.");
        setLoading(false);
        return;
      }
    }

    if (id) {
      // If id is available, check the verification status
      const status = await authGet(
        `payments/check-verification-status?accountId=${id}`
      );
      if (status && status.result && Object.keys(status.result).length > 0) {
        const hasNonNullData = Object.values(status.result).some(
          (value) => value !== null && value.length > 0
        );

        if (
          status.result.current_deadline !== null ||
          status.result.disabled_reason !== null ||
          status.result.currently_due.length > 0 ||
          status.result.past_due.length > 0 ||
          status.result.pending_verification.length > 0 ||
          status.result.errors.length > 0
        ) {
          console.log("We have null data and have the account Id");
          // Redirect to Stripe for further verification
          const accountCreatedResult = await authPost(
            "payments/create-account-link"
          );
          if (accountCreatedResult?.result?.url) {
            window.location.href = accountCreatedResult.result.url;
          }
        } else {
          // Call updateCompleted only when Stripe requirements are fully met
          console.log("We have  data and have the account Id");
          updateCompleted();
        }
      } else {
        // If no data to process, mark verification as completed
        console.log("We have  data and have the account Id");
        updateCompleted();
      }
    }
  };

  useEffect(() => {
    if (params === "connected") {
      checkStripeStatus();
    }
  }, [params]);

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
        {!isVerificationCompleted ? (
          <p style={{ color: "#FFFFFF" }}>Please wait while we processing..</p>
        ) : (
          <>
            <div style={{ textAlign: "-webkit-center", margin: "50px" }}>
              {isVerificationCompleted && show && (
                <LoadingCircle url={"/coach/home"} process={100} />
              )}
            </div>
            <div style={{ textAlign: "-webkit-center" }}>
              <h2
                className="text-center"
                style={{ color: "#FFFFFF", fontSize: "30px", width: "50%" }}
              >
                Generating Your Profile{" "}
              </h2>
              <p
                className="text-center"
                style={{ color: "#FFFFFF", width: "60%" }}
              >
                Our mission is to empower your coaching journey: Connect with
                extraordinary individuals who will inspire and guide you to
                unleash your full coaching potential.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default FinalScreen;
