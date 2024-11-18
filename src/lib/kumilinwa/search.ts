import { FullEntry } from './types';
import { CompleteLangSpec } from './import';

export async function searchLangSpec(
	query: string,
	matching?: MatchType
): Promise<FullEntry[]> {
	const matchWord = matching === 'word' || !matching,
		matchMeaning = matching === 'meaning' || !matching;
	const results: FullEntry[] = [];
	for (const entry of await CompleteLangSpec())
		if (
			(matchWord && entry.word.includes(query)) ||
			(matchMeaning && entry.meaning.includes(query))
		)
			results.push(entry);
	return results;
}

export type MatchType = 'word' | 'meaning';
