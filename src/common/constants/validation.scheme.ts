import { z } from "zod";
import { PaymentMethod } from "../enums/invoice.enum";

export const invoicePacaSchema = z
  .object({
    paymentMethod: z.nativeEnum(PaymentMethod, {
      errorMap: () => ({ message: "Método de pago es requerido" }),
    }),
    paidAmount: z
      .number()
      .min(1, { message: "El monto pagado debe ser mayor a 0" }),
    discounts: z
      .number()
      .nonnegative({ message: "El descuento no puede ser negativo" }),
    customerId: z.string().nullable().optional(),
    invoicePacaDetails: z
      .array(
        z.object({
          pacaId: z
            .string()
            .min(1, { message: "El producto a seleccionar es requerido" }),
          quantity: z
            .number()
            .min(1, { message: "La cantidad debe ser mayor a 0" }),
          price: z
            .number()
            .min(0, { message: "El precio debe ser mayor o igual a 0" }),
          userId: z.string().nullable().optional(),
        })
      )
      .min(1, { message: "Debe agregar al menos un detalle de factura" }),
  })
  .refine(
    (data) => {
      const totalAmount = data.invoicePacaDetails.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      return data.paidAmount >= totalAmount - data.discounts;
    },
    {
      message:
        "El monto pagado debe ser al menos igual al monto total menos descuentos",
      path: ["paidAmount"],
    }
  );

export const invoiceItemSchema = z
  .object({
    paymentMethod: z.nativeEnum(PaymentMethod, {
      errorMap: () => ({ message: "Método de pago es requerido" }),
    }),
    paidAmount: z
      .number()
      .min(1, { message: "El monto pagado debe ser mayor a 0" }),
    discounts: z
      .number()
      .nonnegative({ message: "El descuento no puede ser negativo" }),
    customerId: z.string().nullable().optional(),
    invoiceItemDetails: z
      .array(
        z.object({
          itemId: z
            .string()
            .min(1, { message: "El producto a seleccionar es requerido" }),
          quantity: z
            .number()
            .min(1, { message: "La cantidad debe ser mayor a 0" }),
          price: z
            .number()
            .min(0, { message: "El precio debe ser mayor o igual a 0" }),
          userId: z.string().nullable().optional(),
        })
      )
      .min(1, { message: "Debe agregar al menos un detalle de factura" }),
  })
  .refine(
    (data) => {
      const totalAmount = data.invoiceItemDetails.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      return data.paidAmount >= totalAmount - data.discounts;
    },
    {
      message:
        "El monto pagado debe ser al menos igual al monto total menos descuentos",
      path: ["paidAmount"],
    }
  );
