import { validateCompositeCondition } from "./utils";
import { CompositeCondition, Condition, Rule, RuleResult } from "./types";
import { storageService } from "../api/services";
import { browser } from "../browser-service";

export default class RuleEngine {
  constructor() { }

  async loadRules() {
    let rules: Rule[] = await storageService.getRulesFromStorage();

    if (!rules?.length) {
      browser.runtime.sendMessage({ action: 'loadRules' }, (response) => {
        if (response?.rules) {
          storageService.setRulesToStorage(response?.rules);
          rules = response?.rules;
        }
      });
    }

    return {
      rules: rules || [],
    }
  }

  validateRule(rule: Rule) {
    const required_keys = ["ruleId", "name", "composite_flag_conditions"];
    for (const key of required_keys) {
      if (!(key in rule)) {
        throw new Error(`Rule is missing required key ${key}`);
      }
    }

    const { composite_flag_conditions, composite_false_positives } = rule;
    validateCompositeCondition(composite_flag_conditions);
    if (composite_false_positives?.conditions?.length) {
      validateCompositeCondition(composite_false_positives);
    }
  }

  async checkWebsite(website: any): Promise<RuleResult> {
    const { rules } = await this.loadRules();
    for (const rule of rules) {
      if (this.matchRules(website, rule).matchedRule) {
        return this.matchRules(website, rule);
      }
    }


    return {
      status: "unknown",
      matchedRule: null,
    };
  }

  matchRules(website: any, rule: Rule): RuleResult {
    const { composite_false_positives, composite_flag_conditions } = rule;
    const isFlagged = this.matchCompositeConditionRules(
      website,
      composite_flag_conditions
    );
    const isFalsePositive =
      composite_false_positives &&
      composite_false_positives?.conditions?.length &&
      this.matchCompositeConditionRules(website, composite_false_positives);

    // flagged site
    if (isFlagged && !isFalsePositive) {
      return {
        status: "flagged",
        matchedRule: rule,
      };
    }

    return {
      status: "unknown",
      matchedRule: null,
    };
  }

  matchCompositeConditionRules(
    website: any,
    composite_conditions: CompositeCondition
  ) {
    const { conditions: cds, match_condition } = composite_conditions;
    const result: boolean[] = [];

    for (const condition of cds) {
      const { conditions, logical_operator } = condition;
      if (conditions?.length == 0) continue;
      if (logical_operator == "and") {
        const cond = conditions.every((condition) => {
          return this.matchCondition(website, condition)
        }
        );
        result.push(cond);
      } else if (logical_operator == "or") {
        const cond = conditions.some((condition) => this.matchCondition(website, condition));
        result.push(cond);
      } else if (logical_operator == "not") {
        const cond = conditions.some((condition) =>
          this.matchCondition(website, condition)
        );
        result.push(!cond);
      } else {
        continue;
      }
    }

    if (match_condition === "all") {
      return result.every((e) => e === true);
    } else if (match_condition === "any") {
      return result.some((el) => el === true);
    }
  }

  matchCondition(website: any, condition: Condition): boolean {
    const attribute = condition.attribute;
    const operator = condition.operator;
    const case_sensitive = condition?.case_sensitive ?? true;

    let value = condition.value;
    let website_value: string = "";
    try {
      website_value = website[attribute];
    } catch (error) {
      throw new Error(
        `Error getting attribute ${attribute} from website: ${error}`
      );
    }

    if (!case_sensitive) {
      value = value.toLowerCase();
      website_value = website_value?.toLowerCase();
    }

    if (operator == "contains") {
      return website_value?.includes(value);
    } else if (operator == "starts_with") {
      return website_value?.startsWith(value);
    } else if (operator == "ends_with") {
      return website_value?.endsWith(value);
    } else if (operator == "not_contains") {
      return !website_value?.includes(value);
    } else if (operator == "length_greater_than") {
      return website_value?.length > +value;
    } else if (operator == "length_less_than") {
      return website_value?.length < +value;
    } else if (operator == "equalToAny") {
      if (attribute === "url" && website_value.includes("://")) {
        website_value = website_value.split("://")[1];
        if (website_value.endsWith("/"))
          website_value = website_value.split("/")[0];
      }

      return value
        .split(",")
        .map((el) => el.trim().toLowerCase())
        .includes(website_value.trim().toLowerCase());
    }

    return false;
  }
}
