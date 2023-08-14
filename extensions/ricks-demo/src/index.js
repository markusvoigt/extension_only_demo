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

const variantIDForSubscription = "gid://shopify/ProductVariant/43134047027412";
const variantIDForQuantity = "gid://shopify/ProductVariant/43134048207060";

export default /**
 * @param {Input} input
 * @returns {FunctionResult}
 *
 */
(input) => {
  let discount = {
    targets: new Array(),
    message: `Combined Discount for quantity and selling plan`,
    value: {
      percentage: {
        value: "30",
      },
    },
  };

  input.cart.lines.forEach((line) => {
    const variant = /** @type {ProductVariant} */ (line.merchandise);
    const target = /** @type {Target} */ ({
      productVariant: {
        id: variant.id,
      },
    });
    if (variant.id === variantIDForQuantity) {
      // CHECK IF MORE THAN 3 ARE BOUGHT FOR PRODUCT WITH THIS VARIANTID
      if (line.quantity > 3) {
        discount.targets.push(target);
      }
    } else if (variant.id === variantIDForSubscription) {
      // CHECK IF SEELING PLAN IS PRESENT
      if (line.sellingPlanAllocation?.sellingPlan?.id) {
        discount.targets.push(target);
      }
    }
  });

  if (input.cart.lines.length <= 0) {
    console.error("No cart lines qualify for inventory discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: discount,
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
};

/*
SAMPLE INPUT:
{
  "cart": {
    "lines": [
      {
        "merchandise": {
          "id": "gid://shopify/ProductVariant/43134047027412"
        },
        "quantity": 1,
        "sellingPlanAllocation": {
          "sellingPlan": {
            "id": "gid://shopify/SellingPlan/2824569044"
          }
        }
      },
      {
        "merchandise": {
          "id": "gid://shopify/ProductVariant/43134048207060"
        },
        "quantity": 4,
        "sellingPlanAllocation": null
      }
    ]
  }
}

SAMPLE OUTPUT:
{
  "discounts": {
    "targets": [
      {
        "productVariant": {
          "id": "gid://shopify/ProductVariant/43134047027412"
        }
      },
      {
        "productVariant": {
          "id": "gid://shopify/ProductVariant/43134048207060"
        }
      }
    ],
    "message": "You get 30 % off because you bought more than 3!",
    "value": {
      "percentage": {
        "value": "30"
      }
    }
  },
  "discountApplicationStrategy": "FIRST"
}

*/
