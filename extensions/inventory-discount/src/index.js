// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").CartLine} CartLine
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

export default /**
 * @param {Input} input
 * @returns {FunctionResult}
 *
 */

(input) => {
  const discounts = [];
  const targets = input.cart.lines.forEach((line) => {
    const variant = /** @type {ProductVariant} */ (line.merchandise);
    const target = /** @type {Target} */ ({
      productVariant: {
        id: variant.id,
      },
    });
    const discountPercentage =
      Number(variant.metafield?.value) < 50 ? variant.metafield?.value : "50";
    const discount = {
      targets: target,
      message: `You get ${variant.metafield?.value} off because thats our current inventory!`,
      value: {
        percentage: {
          value: variant.metafield?.value,
        },
      },
    };
    discounts.push(discount);
  });

  if (input.cart.lines.length <= 0) {
    console.error("No cart lines qualify for inventory discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
};
