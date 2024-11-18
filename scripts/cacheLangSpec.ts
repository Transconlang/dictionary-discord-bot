import { LangSpecURL } from '@/config';
import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

await writeFile(
	join(
		dirname(fileURLToPath(import.meta.url)),
		'..',
		'src',
		'lib',
		'kumilinwa',
		'langspec.cache.json'
	),
	JSON.stringify(await fetch(LangSpecURL).then(res => res.json()))
);
