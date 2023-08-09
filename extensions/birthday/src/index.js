// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").Customer} Customer
 * @typedef {import("../generated/api").BuyerIdentity} BuyerIdentity
 * @typedef {import("../generated/api").Cart} Cart
 * @typedef {import("../generated/api").Input} Input
 */

/**
 * @type {FunctionResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

const BIRTHDAY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [
    {
      value: {
        percentage: {
          value: "10",
        },
      },
      targets: [
        {
          orderSubtotal: {
            excludedVariantIds: [],
          },
        },
      ],
      message: "10% off for your birthday",
    },
  ],
};

export default /**
 * @param {Input} input
 * @returns {FunctionResult}
 */

(input) => {
  const today = input.cart.attribute?.value?.split("-") || ["0", "0"];
  const customer = input.cart.buyerIdentity?.customer;
  if (
    Number(customer?.metafield?.value?.split("-")[1]) == Number(today[0]) &&
    Number(customer?.metafield?.value?.split("-")[2]) == Number(today[1])
  ) {
    return BIRTHDAY_DISCOUNT;
  }

  return EMPTY_DISCOUNT;
};
