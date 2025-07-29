import { LangSpecURL } from '@/config';
import Jsoning from 'jsoning';
import { logger } from '../misc/logger';
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const Dirname = join(dirname(fileURLToPath(import.meta.url)));

export async function refreshCachedLangSpec() {
	const data = await fetch(LangSpecURL).then(res => {
        try {
            return res.json();
        } catch {
            res.text().then(text => {
                throw new SyntaxError(`Failed to parse GitHub response body as JSON: ${text}`);
            });
        }
    });
	await writeFile(join(Dirname, 'langspec.cache.json'), JSON.stringify(data));
	await new Jsoning(join(Dirname, '..', '..', '..', 'stats.tmp.db.json')).set(
		'langSpecCacheAge',
		Date.now()
	);
	logger.debug('Cached language specification.');
}
