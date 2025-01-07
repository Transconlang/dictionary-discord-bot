export enum ResourceType {
	Specification = 'spec',
	Guide = 'guide',
	Dictionary = 'dict'
}

export function formatResourceType(type: ResourceType) {
	switch (type) {
		case ResourceType.Specification:
			return 'Specification';
		case ResourceType.Guide:
			return 'Guide';
		case ResourceType.Dictionary:
			return 'Dictionary';
	}
}

export interface Resource {
	name: string;
	url: string;
	type: ResourceType;
}
