export enum PaymentMethod {
  Efectivo = 1,
  Transferencia,
}

export const getGradientColorsPaymentMethod = (paymentMehotd: PaymentMethod) => {
  switch (paymentMehotd) {
    case PaymentMethod.Efectivo:
      return { from: "green", to: "lime", deg: 90 };
    case PaymentMethod.Transferencia:
      return { from: "blue", to: "cyan", deg: 90 };
      //TODO: Uncomment this code when the feature is implemented
    // case PaymentMethod.CreditCard:
    //   return { from: "yellow", to: "orange", deg: 90 };
    // case PaymentMethod.DebitCard:
    //   return { from: "red", to: "orange", deg: 90 };
    default:
      return { from: "gray", to: "darkgray", deg: 90 };
  }
};
