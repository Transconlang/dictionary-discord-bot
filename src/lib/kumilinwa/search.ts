import { FullEntry } from './types';
import { CompleteLangSpec } from './import';

export async function searchLangSpec(
	query: string,
	matching?: MatchType
): Promise<FullEntry[]> {
	const matchWord = matching === 'word' || !matching,
		matchMeaning = matching === 'meaning' || !matching,
		matchImpl = matching === 'impl' || !matching,
		matchObscurism = matching === 'obscurism' || !matching;
	const results: FullEntry[] = [];
	for (const entry of await CompleteLangSpec())
		if (
			(matchWord && entry.word.includes(query)) ||
			(matchMeaning && (entry.meaning ?? entry.impl!).includes(query)) ||
			(matchImpl && entry.impl?.includes(query)) ||
			(matchObscurism && entry.obscurism?.includes(query))
		)
			results.push(entry);
	return results;
}

export type MatchType = 'word' | 'meaning' | 'impl' | 'obscurism' | 'all';
