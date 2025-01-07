import { Resource, ResourceType } from '.';

export const SourcesList: Resource[] = [
	{
		name: 'Vocabulary List',
		url: 'https://github.com/transconlang/translang/tree/main/Vocabulary',
		type: ResourceType.Specification
	},
	{
		name: 'Grammar',
		url: 'https://github.com/transconlang/translang/blob/main/Grammar.md',
		type: ResourceType.Specification
	},
	{
		name: 'Examples',
		url: 'https://github.com/transconlang/translang/blob/main/Examples.md',
		type: ResourceType.Specification
	},
	{
		name: 'Obscurisms',
		url: 'https://github.com/transconlang/translang/blob/main/Obscurisms.md',
		type: ResourceType.Specification
	},
	{
		name: 'Phonetics',
		url: 'https://github.com/transconlang/translang/blob/main/Phonetics.md',
		type: ResourceType.Specification
	},
	{
		name: 'Te Tobacun Kumilinwa "Official"',
		url: 'https://transconlang.github.io/dictionary-webapp/',
		type: ResourceType.Dictionary
	}
];
