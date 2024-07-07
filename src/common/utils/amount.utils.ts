export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};
