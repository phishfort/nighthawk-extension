import { CompositeCondition } from "../types";

export const validateCompositeCondition = (
  composeCondition: CompositeCondition
) => {
  if (
    !("conditions" in composeCondition && "match_condition" in composeCondition)
  ) {
    throw new Error(
      `composite_flag_conditions must have conditions and match_condition`
    );
  }

  if (!Array.isArray(composeCondition.conditions)) {
    throw new Error(`composite_flag_conditions must be an array`);
  }

  for (const composite of [...composeCondition.conditions]) {
    if (!("logical_operator" in composite && "conditions" in composite)) {
      throw new Error(
        `composite_flag_conditions and composite_false_positive must have logical_operator and conditions`
      );
    }
  }

  // conditions is an array
  for (const composite of [...composeCondition.conditions]) {
    for (const condition of composite.conditions) {
      if (
        !(
          "attribute" in condition &&
          "operator" in condition &&
          "value" in condition
        )
      ) {
        throw new Error(`condition must have attribute, operator, and value`);
      }
    }
  }
};
