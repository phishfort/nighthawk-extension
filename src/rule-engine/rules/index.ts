export async function getRules() {
	return [
		{
			ruleID: 'cf02bcfe4ffa45bf9367155ea9ec4f7f',
			name: 'metamask-restoresweb.webflow.io',
			authorName: '',
			description: 'Rule for metamask-restoresweb.webflow.io',
			meta: '',
			target: '',
			composite_flag_conditions: {
				match_condition: 'all',
				conditions: [
					{
						logical_operator: 'and',
						conditions: [
							{
								attribute: 'html',
								operator: 'contains',
								value: 'Welcome to MetaMask Wallet Restore page'
							},
							{
								attribute: 'html',
								operator: 'contains',
								value: 'RESTORE WALLET',
								case_sensitive: true
							},
							{
								attribute: 'title',
								operator: 'contains',
								value: 'metamask-restoresweb',
								case_sensitive: true
							}
						]
					},
					{
						logical_operator: 'or',
						conditions: [
							{
								attribute: 'html',
								operator: 'contains',
								value: 'A crypto wallet &amp; gateway to blockchain apps'
							},
							{
								attribute: 'html',
								operator: 'contains',
								value: 'Copyright © 2023 MetaMask'
							}
						]
					}
				]
			},
			composite_false_positives: {
				match_condition: 'any',
				conditions: [
					{
						logical_operator: 'or',
						conditions: [
							{
								attribute: 'url',
								operator: 'contains',
								value: 'metamask.com'
							}
						]
					}
				]
			}
		}
	];
}
