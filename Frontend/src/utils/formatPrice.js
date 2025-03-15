// convert money to vnd currency
export const formatPrice = (price) => {
  const vndAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

  return vndAmount;
};
