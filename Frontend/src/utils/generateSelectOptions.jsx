export const generateSelectOptions = (number) => {
  return Array.from({ length: number }, (_, index) => {
    const amount = index + 1;

    return (
      <option key={index} value={amount}>
        {amount}
      </option>
    );
  });
};
