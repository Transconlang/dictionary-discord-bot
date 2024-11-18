import { FullEntry } from './types';

export const CompleteLangSpec = (await import(
	'./langspec.cache.json'
)).default as FullEntry[];
