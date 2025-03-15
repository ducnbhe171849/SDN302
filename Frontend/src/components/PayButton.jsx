import React from "react";
import { useCheckout } from "@stripe/react-stripe-js";

const PayButton = () => {
  const { confirm } = useCheckout();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleClick = () => {
    setLoading(true);
    confirm().then((result) => {
      if (result.type === "error") {
        setError(result.error);
      }
      setLoading(false);
    });
  };

  return (
    <div className="cursor-pointer">
      <button
        disabled={loading}
        className="btn btn-block btn-success border-4"
        onClick={handleClick}
      >
        Pay
      </button>
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default PayButton;
