import { Elements } from "@stripe/react-stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
const stripePromise = loadStripe(
  "pk_test_51OmriNHtA3SK3biQ6qq8s1IrRmnZ08NsSlklyXD9GN8gLPGsR4tGqH08FkxkBDvPrEMIPLEIQMkAc8NrASOByh6E00ayjZlEWe"
);

const PaymentsExample = ({
  isOpen,
  toggleModal,
  payWithCard,
  attachPaymentMethodAndPay,
  handlePayWithCard,
  userCards,
  setPayWithCard,
  tipAmount,
  stripeImage,
  loading,
}) => {
  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            !payWithCard ? attachPaymentMethodAndPay(e) : handlePayWithCard(e);
          }}
          className="max-w-md mx-auto mt-8 bg-white shadow-sm md:shadow-md p-6 rounded z-50"
        >
          {userCards && userCards?.length > 0 && (
            <div className="card-scrollbar w-full h-36  overflow-y-hidden overflow-x-auto flex items-center">
              {userCards?.map((item, index) => (
                <div
                  key={index}
                  className={`p-2 rounded mb-5 flex items-center justify-start m-2 border min-w-36 flex-col gap-1 cursor-pointer ${
                    currentIndex === index
                      ? "border-blue-600"
                      : "border-gray-200"
                  }`}
                  onClick={() => {
                    setCurrentCard(item);
                    setCurrentIndex((prevIndex) =>
                      prevIndex === index ? null : index
                    );
                    console.log(item.card_id);
                    setPayWithCard((prev) => currentIndex !== index || !prev);
                    console.log(payWithCard);
                  }}
                >
                  <div className="flex justify-start items-center">
                    <div className="w-2 h-2 rounded-full bg-neonBlue mr-2"></div>
                    <img
                      src={item?.brand_name === "visa" ? visa : master}
                      className="w-14 h-10"
                    />
                  </div>
                  <p className="text-xs flex justify-center items-center">{`**** **** **** ${item.lastdigit}`}</p>
                </div>
              ))}
            </div>
          )}

          {!payWithCard && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                htmlFor="card-element"
              >
                Enter Card Details
              </label>

              <div className="flex flex-col gap-1 border border-gray-300 rounded p-3">
                <label className="text-md">Card Number</label>
                <CardNumberElement
                  options={{
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
                    showIcon: true,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 my-6">
                <div className="flex flex-col gap-1 border border-gray-300 rounded p-3">
                  <label className="text-md">Card Cvc</label>
                  <CardCvcElement
                    options={{
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
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 border border-gray-300 rounded p-3">
                  <label className="text-md">Card Expiry</label>
                  <CardExpiryElement
                    options={{
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
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1 border border-gray-300 rounded p-3 mb-5 bg-gray-200">
            <label className="text-md text-black/45">Amount</label>
            <div className="flex gap-1">
              <p className="text-black/45">$</p>
              <input
                type="number"
                value={tipAmount || 0}
                disabled
                className="flex-1 flex outline-none text-black/45"
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="bg-neonBlue hover:bg-neonBlueLight text-white font-bold py-2 w-[80%] px-4 rounded"
              type={loading ? "" : "submit"}
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
          <div className="w-full h-16 object-contain my-6">
            <img src={stripeImage} alt="" className="w-full h-full" />
          </div>
        </form>
      </div>
    </>
  );
};

// Wrap your component with Elements provider
const PaymentsExampleWithElements = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentsExample />
    </Elements>
  );
};

export default PaymentsExampleWithElements;
