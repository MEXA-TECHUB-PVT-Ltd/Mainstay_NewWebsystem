import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Modal,
  ModalHeader,
  Alert,
  Spinner,
  Input,
  Button,
  ModalBody,
} from "reactstrap";
import { post, get, authGet } from "../../../../urls/api"; // Assuming 'get' is similar to your 'post' function for API calls
import { useNavigate } from "react-router-dom";
import SuccessModal from "../SuccessModal";
import moment from "moment";
import stripeImg from "../../../../@core/assets/images/banner/stripe.png";
import threeD from "../../../../@core/assets/images/banner/3d.png";
import mastercard from "../../../../@core/assets/images/banner/mastercard.png";
import visa from "../../../../@core/assets/images/banner/visa.png";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const CheckoutForm = ({
  toggle,
  coach_id,
  session_id,
  amount,
  refetch,
  date,
  time,
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("loginUserData")) || [];
  const user = userData?.user ? userData?.user : userData;

  console.log("USERID", user.id);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const toggleSuccessOpen = () => {
    setIsSuccessOpen(!isSuccessOpen);
  };
  const handleOpenSuccess = () => {
    setIsSuccessOpen(true);
  };
  const handleCloseSuccess = () => {
    // setTimeout(() => {
    if (refetch) {
      refetch();
    }
    // navigate(`/coachee/coach-detail/${coach_id}?session=${session_id}`);
    window.location.reload();
    // }, 4000);
    setIsSuccessOpen(false);
  };

  useEffect(() => {
    if (user?.id) {
      setIsCardLoading(true);
      authGet(`payments/get-user-cards/${user.id}`)
        .then((response) => setSavedCards(response?.result))
        .catch((error) => console.log("Error fetching saved cards: ", error))
        .finally(() => setIsCardLoading(false));
    }
  }, [user?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Ensure Stripe and elements are loaded
    if (!stripe || !elements) {
      console.log("Stripe.js has not loaded yet.");
      setIsLoading(false); // Stop the loading process as it cannot proceed
      return;
    }

    let paymentMethodId = selectedCard;

    // Check if a new card entry is needed (i.e., no card is selected)
    if (!selectedCard) {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        console.log(
          "Card number details are not entered yet or not loaded properly."
        );
        setIsLoading(false);
        return;
      }

      // Ensure the CardElement is not null
      if (!cardNumberElement) {
        console.log("Card details are not entered yet.");
        setIsLoading(false);
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
      });

      if (error) {
        console.log("[error]", error);
        setIsLoading(false);
        return;
      } else {
        console.log("paymentMethod", paymentMethod);
        paymentMethodId = paymentMethod.id;
      }
    }

    if (paymentMethodId) {
      try {
        if (!selectedCard) {
          await post("payments/create-customer", {
            user_id: user.id,
            paymentMethodId,
          });
        }

        const paymentResponse = await post("payments/transfer-funds", {
          coach_id,
          coachee_id: user.id,
          paymentMethodId,
          session_id,
          amount,
        });

        if (paymentResponse?.success) {
          setIsSuccessOpen(true);
          setPaymentSuccess(true);
          // setTimeout(() => {
          //   if (refetch) {
          //     refetch();
          //   }
          //   navigate(`/coachee/coach-detail/${coach_id}?session=${session_id}`);
          // }, 4000);
        }
      } catch (error) {
        console.log("Error initiating payment: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const CARD_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      {paymentSuccess && (
        <Alert color="success">
          {t("Your payment has been successfully processed!")}
        </Alert>
      )}
      {/* {savedCards.length > 0 && (
        <div>
          <label>Select a saved card:</label>
          <Input
            type="select"
            name="savedCards"
            id="savedCardSelect"
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            style={{ margin: "10px 0", width: "100%", padding: "8px" }}
          >
            <option value="">Enter a new card</option>
            {savedCards.map((card) => (
              <option key={card.card_id} value={card.card_id}>
                {card.brand} ending in {card.last4} (exp {card.exp_month}/
                {card.exp_year})
              </option>
            ))}
          </Input>
        </div>
      )} */}

      {!selectedCard && (
        <>
          <div className="order-summary-container">
            <div className="order-summary">
              <h2
                className="order-summary-title font-bold text-bold font-w-bold"
                style={{ fontWeight: "bold" }}
              >
                {t("Order Summary")}
              </h2>
              <div className="order-summary-details">
                <p
                  className="order-summary-item"
                  style={{ fontWeight: "bold" }}
                >
                  {t("Total Amount:")}
                  <span className="order-summary-amount">{`CHF ${amount}`}</span>
                </p>
                <p
                  className="order-summary-item"
                  style={{ fontWeight: "bold" }}
                >
                  {t("Duration:")}
                  <span className="order-summary-duration">
                    {time} {t("mins")}
                  </span>
                </p>
                <p
                  className="order-summary-item"
                  style={{ fontWeight: "bold" }}
                >
                  {t("Date")}:
                  <span className="order-summary-date">
                    {moment(date).format("DD/MM/YYYY")}
                  </span>
                </p>
              </div>
            </div>
            <div className="card-details">
              <h2 className="card-details-title">
                {" "}
                {t("Enter Card Details")}{" "}
              </h2>
              <div className="card-details-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="card-number">
                    {t("Card Number")}
                  </label>
                  <div className="form-control">
                    <CardNumberElement options={CARD_OPTIONS} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="card-expiry">
                    {t("Card Expiry")}
                  </label>
                  <div className="form-control">
                    <CardExpiryElement options={CARD_OPTIONS} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="card-cvc">
                    {t("CVC")}
                  </label>
                  <div className="form-control">
                    <CardCvcElement options={CARD_OPTIONS} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Button
        className="w-full mt-2"
        style={{ borderRadius: "35px", width: "100%" }}
        color="primary"
        disabled={!stripe || isLoading}
        type="submit"
      >
        {isLoading ? <Spinner size="sm" /> : t("Pay")}
      </Button>
      <SuccessModal
        isOpen={isSuccessOpen}
        toggle={handleCloseSuccess}
        title={t("Payment Success")}
        text={t("You received a wellcoin")}
      />
      <div
        className="card-images-container"
        style={{ marginTop: "20px", overflowX: "auto" }}
      >
        <div
          className="card-images d-flex align-items-center"
          style={{ maxWidth: "100%", flexWrap: "nowrap" }}
        >
          <img
            src={stripeImg}
            alt="Stripe"
            className="card-image"
            style={{
              maxWidth: "30%",
              height: "auto",
              marginRight: "10px",
              transition: "transform 0.3s ease-in-out",
            }}
          />
          <img
            src={visa}
            alt="Visa"
            className="card-image"
            style={{
              maxWidth: "15%",
              height: "auto",
              marginRight: "10px",
              transition: "transform 0.3s ease-in-out",
            }}
          />
          <img
            src={mastercard}
            alt="Mastercard"
            className="card-image"
            style={{
              maxWidth: "15%",
              height: "auto",
              marginRight: "10px",
              transition: "transform 0.3s ease-in-out",
            }}
          />
          <img
            src={threeD}
            alt="3D Secure"
            className="card-image"
            style={{
              maxWidth: "30%",
              height: "auto",
              marginRight: "10px",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </div>
      </div>
    </form>
  );
};

// StripeForm component for displaying the modal
const StripeForm = ({
  isOpen,
  toggle,
  coach_id,
  session_id,
  amount,
  refetch,
  date,
  time,
}) => (
  <Modal
    isOpen={isOpen}
    // isOpen={true}
    toggle={toggle}
    className="payment-modal modal-dialog-centered"
  >
    <ModalHeader toggle={toggle}>
      {" "}
      <h3>{t("Payment Details")}</h3>{" "}
    </ModalHeader>
    <CheckoutForm
      toggle={toggle}
      coach_id={coach_id}
      session_id={session_id}
      amount={amount}
      refetch={refetch}
      date={date}
      time={time}
    />
  </Modal>
);

const PaymentModal = ({
  isOpen,
  toggle,
  coach_id,
  session_id,
  amount,
  refetch,
  date,
  time,
}) => {
  console.log(time);
  const stripePromise = loadStripe(
    "pk_test_51OmriNHtA3SK3biQ6qq8s1IrRmnZ08NsSlklyXD9GN8gLPGsR4tGqH08FkxkBDvPrEMIPLEIQMkAc8NrASOByh6E00ayjZlEWe"
  );
  return (
    <Elements stripe={stripePromise}>
      <StripeForm
        isOpen={isOpen}
        toggle={toggle}
        coach_id={coach_id}
        session_id={session_id}
        amount={amount}
        refetch={refetch}
        date={date}
        time={time}
      />
    </Elements>
  );
};

export default PaymentModal;
