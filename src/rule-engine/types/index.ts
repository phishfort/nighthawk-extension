export interface Rule {
	ruleID: string;
	name: string;
	authorName: string;
	description: string;
	meta: string;
	target: string;
	composite_flag_conditions: CompositeCondition;
	composite_false_positives: CompositeCondition;
}

export interface CompositeCondition {
	match_condition: string;
	conditions: CompositeF[];
}

export interface CompositeF {
	logical_operator: string;
	conditions: Condition[];
}

export interface Condition {
	attribute: string;
	operator: string;
	value: string;
	case_sensitive?: boolean;
}

export interface Website {
	html: string[];
	url: string[];
	buttons: string[];
	text: string[];
	links: string[];
	scripts: string[];
	title: string[];
	forms: string[];
	images: string[];
	jsLibs: string[];
}

export interface RuleResult {
	status: RuleResultStatus;
	matchedRule: Rule | null;
}

export type RuleResultStatus = 'unknown' | 'flagged' | 'false_positive';
export type MatchedCondition = 'all' | 'any';
