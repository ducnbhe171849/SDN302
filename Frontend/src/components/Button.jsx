import React from "react";
import { useNavigation } from "react-router-dom";

const Button = ({ text }) => {
  // navigation state
  const navigation = useNavigation();

  const isSubmit = navigation.state === "submitting";

  return (
    <button
      type="submit"
      className="btn btn-primary btn-block"
      disabled={isSubmit}
      value={"submit"}
    >
      {isSubmit ? (
        <>
          <span className="loading loading-bars loading-lg"></span>
        </>
      ) : (
        text || "submit"
      )}
    </button>
  );
};

export default Button;
