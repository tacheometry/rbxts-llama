type ObjectKey = string | number | symbol;

export type KeyValuePairsFromLists<
	Keys extends Array<ObjectKey>,
	Values extends Array<any>
> = {
	[index in keyof Keys]: index extends keyof Values
		? [Keys[index], Values[index]]
		: never;
};
export type ObjectFromKeyValuePairs<
	KV extends Array<[ObjectKey, any]>,
	T = {
		[index in keyof KV]: KV[index] extends [ObjectKey, any]
			? Record<KV[index][0], KV[index][1]>
			: never;
	}
> = UnionToIntersection<T[keyof T]>;

export type ObjectFromKeyValueArrays<
	Keys extends Array<ObjectKey>,
	Values extends Array<any>
> = ObjectFromKeyValuePairs<KeyValuePairsFromLists<Keys, Values>>;
