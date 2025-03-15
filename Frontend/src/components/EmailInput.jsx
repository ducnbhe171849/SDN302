import React from "react";
import { useCheckout } from "@stripe/react-stripe-js";

const EmailInput = () => {
  const checkout = useCheckout();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState(null);

  const handleBlur = () => {
    checkout.updateEmail(email).then((result) => {
      if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleChange = (e) => {
    setError(null);
    setEmail(e.target.value);
  };
  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default EmailInput;
