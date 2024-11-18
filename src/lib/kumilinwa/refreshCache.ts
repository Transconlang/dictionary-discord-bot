import { LangSpecURL } from '@/config';
import Jsoning from 'jsoning';
import { logger } from '../misc/logger';
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const Dirname = join(dirname(fileURLToPath(import.meta.url)));

export async function refreshCachedLangSpec() {
	const data = await fetch(LangSpecURL).then(res => res.json());
	await writeFile(join(Dirname, 'langspec.cache.json'), JSON.stringify(data));
	await new Jsoning(join('..', '..', '..', 'stats.tmp.db.json')).set(
		'langSpecCacheAge',
		Date.now()
	);
	logger.debug('Cached language specification.');
}
