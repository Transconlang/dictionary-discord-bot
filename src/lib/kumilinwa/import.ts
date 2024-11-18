import { FullEntry } from './types';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export async function CompleteLangSpec() {
	return JSON.parse(
		await readFile(
			join(dirname(fileURLToPath(import.meta.url)), 'complete-lang-spec.json'),
			'utf-8'
		)
	) as FullEntry[];
}
