// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   CheckoutProvider,
//   PaymentElement,
//   useCheckout,
// } from "@stripe/react-stripe-js";
// import { PayButton } from "../components";

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// // This is your test secret API key.
// const stripe = loadStripe(
//   "pk_test_51QjHlWCdY54ZfXM8qvWUN8rOi8tWMUURLsYgozV6NGmykV0o1A2EA1xLFky9scffUXptzuMa5O52NMbI3t4aeji800L2n1J4Rm",
//   {
//     betas: ["custom_checkout_beta_5"],
//   }
// );

// // Component xử lý thanh toán
// const CheckoutForm = () => {
//   const checkout = useCheckout();
//   return (
//     <form>
//       <PaymentElement options={{ layout: "accordion" }} />
//       <PayButton></PayButton>
//     </form>
//   );
// };

// // Component chính
// const StripePayment = () => {
//   const [clientSecret, setClientSecret] = React.useState(null);
//   useEffect(async () => {
//     await fetch("http://localhost:3000/api/v1/employee/id/salary/payment", {
//       method: "POST",
//     })
//       .then((response) => response.json())
//       .then((json) => setClientSecret(json.clientSecret));
//   }, []);

//   if (clientSecret) {
//     return (
//       <CheckoutProvider stripe={stripe} options={{ clientSecret }}>
//         <CheckoutForm></CheckoutForm>
//       </CheckoutProvider>
//     );
//   } else {
//     return null;
//   }
// };

// export default StripePayment;
