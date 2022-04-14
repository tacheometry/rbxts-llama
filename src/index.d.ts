import { ObjectFromKeyValueArrays } from "./Zip";

type LlamaNone = {
	/**
	 * @hidden
	 * @deprecated
	 */
	readonly __llamaNone: unique symbol;
};
type Noneify<T> = Exclude<T, LlamaNone>;
type TryIndex<D extends object, K> = K extends keyof D ? D[K] : undefined;
type ReplaceTypeWithType<T, A, B> = A extends T ? Exclude<T, A> | B : T;
type LuaTable = object | unknown[];

/**
 * Dictionaries are tables with key-value pairs.
 */
declare namespace Dictionary {
	/* Constructors */

	/**
	 * Returns a new dictionary constructed from `keys` and `values`. The lists are expected to be the same size.
	 * *Example:*
	 *
	 * ```lua
	 * local keys = { "foo", "bar", "baz" }
	 * local values = { 1, 2, 3 }
	 *
	 * Llama.Dictionary.fromLists(keys, values)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = 1,
	 * 	bar = 2,
	 * 	baz = 3,
	 * }
	 * ```
	 */
	function fromLists<
		K extends (string | number | symbol)[],
		V extends AnyList
	>(keys: K, values: V): ObjectFromKeyValueArrays<K, V>;

	/* Copying */
	/**
	 * Returns a shallow copy of `dictionary`.
	 */
	function copy<T extends object>(dictionary: T): T;

	/**
	 * Returns a deep copy of `dictionary`.
	 *
	 * **Warning:** Deep copying is more expensive than shallow copying and forces you to resort to the more expensive `equalsDeep` for value equality checking. Only use it when absolutely necessary.
	 */
	function copyDeep<T extends object>(dictionary: T): T;

	/* Comparing */
	/**
	 * Returns whether all `dictionaries` have shallow value equality.
	 */
	function equals(...dictionaries: object[]): boolean;

	/**
	 * Returns whether all `dictionaries` have deep value equality.
	 *
	 * **Warning:** Deep comparison is more expensive than shallow comparison. Only use it when absolutely necessary.
	 */
	function equalsDeep(...dictionaries: object[]): boolean;

	/* Persistent changes */
	/**
	 * Returns a new dictionary with all of the entries of `dictionaries` merged together. Later entries replace older ones, and `Llama.None` can be used to remove values.
	 *
	 * *Example:*
	 * ```lua
	 * local a = {
	 * 	key = "value",
	 * 	foo = "bar",
	 * 	removeMe = 0,
	 * }
	 *
	 * local b = {
	 * 	removeMe = Llama.None,
	 * 	addMe = 1,
	 * }
	 *
	 * Llama.Dictionary.merge(a, b)
	 * ```
	 * *Results:*
	 * ```lua
	 * {
	 * 	key = "value",
	 * 	foo = "bar",
	 * 	addMe = 1,
	 * }
	 * ```
	 * @alias `Dictionary.join`
	 */
	function merge<T extends object[]>(
		...dictionaries: T
	): Noneify<UnionToIntersection<T[keyof T]>>;

	/**
	 * Returns a new dictionary with all of the entries of `dictionaries` merged together. Later entries replace older ones, and Llama.None` can be used to remove values.
	 * @alias `Dictionary.merge`
	 */
	const join: typeof merge;

	/**
	 * Returns a new dictionary with all of the entries of `dictionaries` deeply merged together. Later entries replace older ones, and `Llama.None` can be used to remove values.
	 *
	 * **Warning:** Deep merging is more expensive than shallow merging and forces you to resort to the more expensive `equalsDeep` for value equality checking. Only use it when absolutely necessary.
	 *
	 * *Example:*
	 * ```lua
	 * local a = {
	 * 	key = "value",
	 * 	foo = "bar",
	 * 	dictionary = {
	 * 		foo = "foo",
	 * 		bar = "bar",
	 * 	},
	 * 	removeMe = 0,
	 * }
	 *
	 * local b = {
	 * 	removeMe = Llama.None,
	 * 	addMe = 1,
	 * 	dictionary = {
	 * 		baz = "baz",
	 * 	},
	 * }
	 *
	 * Llama.Dictionary.mergeDeep(a, b)
	 * ```
	 * *Results:*
	 * ```lua
	 * {
	 * 	key = "value",
	 * 	foo = "bar",
	 * 	addMe = 1,
	 * 	dictionary = {
	 * 		foo = "foo",
	 * 		bar = "bar",
	 * 		baz = "baz",
	 * 	},
	 * }
	 * ```
	 * @alias `Dictionary.joinDeep`
	 */
	function mergeDeep<T extends object[]>(
		...dictionaries: T
	): Noneify<UnionToIntersection<T[keyof T]>>;

	/**
	 * Returns a new dictionary with all of the entries of `dictionaries` deeply merged together. Later entries replace older ones, and `Llama.None` can be used to remove values.
	 *
	 * **Warning:** Deep merging is more expensive than shallow merging and forces you to resort to the more expensive `equalsDeep` for value equality checking. Only use it when absolutely necessary.
	 * @alias `Dictionary.mergeDeep`
	 */
	const joinDeep: typeof mergeDeep;

	/**
	 * Returns a new dictionary with the entry at `key` is removed from `dictionary`.
	 */
	function removeKey<D extends object, K extends keyof D>(
		dictionary: D,
		key: K
	): Exclude<D, K>;

	/**
	 * Returns new dictionary with entries at `keys` are removed from `dictionary`.
	 */
	function removeKeys<D extends object, K extends (keyof D)[]>(
		dictionary: D,
		...keys: K
	): Exclude<D, K[keyof K]>;

	/**
	 * Returns a new dictionary where any entry with `value` are removed from `dictionary`.
	 */
	function removeValue<D extends object, V extends D[keyof D]>(
		dictionary: D,
		value: V
	): ExcludeMembers<D, V>;

	/**
	 * Returns a new dictionary where any entry with any `values` are removed from `dictionary`.
	 */
	function removeValues<D extends object, V extends D[keyof D][]>(
		dictionary: D,
		...values: V
	): ExcludeMembers<D, V[keyof V]>;

	/**
	 * Returns a new dictionary with the entry at `key` in `dictionary` is set to `value`.
	 */
	function set<D extends object, K extends keyof D, V extends D[K]>(
		dictionary: D,
		key: K,
		value: V
	): D & {
		[key in K]: V;
	};

	/**
	 * Returns a new dictionary with the entry at `key` is updated by `updater`. If the entry does not exist, `callback` is invoked and the entry is created from its return value.
	 *
	 * > `updater` and `callback` are expected to have the following signatures:
	 * > ```
	 * > updater(value, key) -> value
	 * > callback(key) -> value
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local dictionary = {
	 * 	foo = "foo",
	 * 	bar = "bar",
	 * }
	 *
	 * local function fooify(value)
	 * 	return "foo" .. value
	 * end
	 *
	 * Llama.Dictionary.update(dictionary, "bar", fooify)
	 * Llama.Dictionary.update(dictionary, "baz", fooify, function()
	 * 	return "baz"
	 * end)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = "foo",
	 * 	bar = "foobar",
	 * }
	 *
	 * {
	 * 	foo = "foo",
	 * 	bar = "bar",
	 * 	baz = "baz",
	 * }
	 * ```
	 */
	function update<
		D extends object,
		K extends string | number,
		U = TryIndex<D, K>,
		C = undefined
	>(
		dictionary: D,
		key: K,
		updater?: (value: TryIndex<D, K>, key: K) => U,
		callback?: (key: K) => C
	): TryIndex<D, K> extends undefined
		? {
				[key in keyof D]: key extends K ? U : D[key];
		  }
		: {
				[key in keyof D]: key extends K ? C : D[key];
		  };

	/**
	 * Returns a new dictionary with only the entries of `dictionary` for which `filterer` returns a truthy.
	 *
	 * > `filterer` is expected to have the following signature:
	 * > ```
	 * > filterer(value, key) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local dictionary = {
	 * 	foo1 = "foo",
	 * 	foo2 = "foo",
	 * 	bar = "foo",
	 * }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.Dictionary.filter(dictionary, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo1 = "foo",
	 * 	foo2 = "foo",
	 * }
	 * ```
	 */
	function filter<D extends object>(
		dictionary: D,
		filterer: (value: D[keyof D], key: keyof D) => unknown
	): Partial<D>;

	/**
	 * Returns a new dictionary with the keys and values of `dictionary` swapped.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local dictionary = {
	 * 	foo = "oof",
	 * 	bar = "rab",
	 * 	baz = "zab",
	 * }
	 *
	 * Llama.Dictionary.flip(dictionary)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	oof = "foo",
	 * 	rab = "bar",
	 * 	zab = "baz",
	 * }
	 * ```
	 */
	function flip<D extends object>(dictionary: D): object;

	/**
	 * Returns a new dictionary with the values (and keys) of `dictionary` mapped over using `mapper`.
	 *
	 * > **TS note:** To use this with the `key` parameter, the return value must be casted to a `LuaTuple`:
	 * > ```
	 * > Dictionary.map(
	 * >	{ foo: 5, baz: 6 },
	 * >	(value, key) => {
	 * >		return [value + 1, key + "Incremented"] as LuaTuple<[number, string]>
	 * >	}
	 * >);
	 * >```
	 *
	 * ```
	 * > `mapper` is expected to have the following signature:
	 * > ```
	 * > mapper(value, key) -> value[, key]
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local dictionary = {
	 * 	foo = "foo",
	 * 	bar = "bar",
	 * 	baz = "baz",
	 * }
	 *
	 * local function fooify(value)
	 * 	return "foo" .. value
	 * end
	 *
	 * Llama.Dictionary.map(dictionary, fooify)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = "foofoo",
	 * 	bar = "foobar",
	 * 	baz = "foobaz",
	 * }
	 * ```
	 */
	function map<D extends object, RV, RK extends string | number | symbol>(
		dictionary: D,
		mapper: (value: D[keyof D], key: keyof D) => LuaTuple<[RV, RK]>
	): {
		[key in RK]: RV;
	};

	/**
	 * Returns a new dictionary with the values (and keys) of `dictionary` mapped over using `mapper`.
	 *
	 * > **TS note:** To use this with the `key` parameter, the return value must be casted to a `LuaTuple`:
	 * > ```
	 * > Dictionary.map(
	 * >	{ foo: 5, baz: 6 },
	 * >	(value, key) => {
	 * >		return [value + 1, key + "Incremented"] as LuaTuple<[number, string]>
	 * >	}
	 * >);
	 * >```
	 *
	 * ```
	 * > `mapper` is expected to have the following signature:
	 * > ```
	 * > mapper(value, key) -> value[, key]
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local dictionary = {
	 * 	foo = "foo",
	 * 	bar = "bar",
	 * 	baz = "baz",
	 * }
	 *
	 * local function fooify(value)
	 * 	return "foo" .. value
	 * end
	 *
	 * Llama.Dictionary.map(dictionary, fooify)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = "foofoo",
	 * 	bar = "foobar",
	 * 	baz = "foobaz",
	 * }
	 * ```
	 */
	function map<D extends object, R>(
		dictionary: D,
		mapper: (value: D[keyof D], key: keyof D) => R
	): {
		[key in keyof D]: R;
	};

	/* Reading values */
	/**
	 * Returns whether `dictionary` has a value at the `key`.
	 */
	function has<D extends object, K extends string | number | symbol>(
		dictionary: D,
		key: K
	): TryIndex<D, K> extends undefined ? false : true;

	/**
	 * Returns whether `dictionary` includes a `value`.
	 */
	function includes<D extends object, V>(
		dictionary: D,
		value: V
	): V extends D[keyof D] ? true : false;

	/* Conversion */
	/**
	 * Returns a list of `dictionary`'s keys.
	 */
	function keys<D extends object>(dictionary: D): (keyof D)[];

	/**
	 * Returns a list of `dictionary`'s values.
	 */
	function values<D extends object>(dictionary: D): D[keyof D][];

	/* Reducing */
	/**
	 * Returns the number of entries in `dictionary` for which `predicate` returns a truthy. If `predicate` is not provided, `count` simply counts all of the entries in `dictionary` (useful since `#dictionary` does not give the number of dictionary entries, only the number of list entries).
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, key) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local dictionary = {
	 * 	foo1 = "foo",
	 * 	foo2 = "foo",
	 * 	bar1 = "bar",
	 * 	bar2 = "bar",
	 * }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.Dictionary.count(dictionary, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * 2
	 * ```
	 */
	function count<D extends object>(
		dictionary: D,
		predicate?: <K extends keyof D>(value: D[K], key: K) => unknown
	): number;

	/**
	 * Returns whether `predicate` returns a truthy for ***all*** of `dictionary`'s entries.
	 *
	 * > **TS note:** To use this with the `key` argument, the return value must be casted to a `LuaTuple`:
	 * > ```
	 * > Dictionary.map(
	 * >	{ foo: 5, baz: 6 },
	 * >	(value, key) => {
	 * >		return [value + 1, key + "Incremented"] as LuaTuple<[number, string]>
	 * >	}
	 * >);
	 * >```
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, key) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = {
	 * 	foo1 = "foo",
	 * 	foo2 = "foo",
	 * }
	 *
	 * local b = {
	 * 	foo = "foo",
	 * 	bar = "bar",
	 * 	baz = "baz",
	 * }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.Dictionary.every(a, onlyFoo)
	 * Llama.Dictionary.every(b, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * true
	 * false
	 * ```
	 */
	function every<D extends object>(
		dictionary: D,
		predicate: <K extends keyof D>(value: D[K], key: K) => unknown
	): boolean;

	/**
	 * Returns whether `predicate` returns a truthy for ***any*** of `dictionary`'s entries.
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, key) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = {
	 * 	bar1 = "bar",
	 * 	bar2 = "bar",
	 * }
	 *
	 * local b = {
	 * 	foo = "foo",
	 * 	bar = "bar",
	 * 	baz = "baz",
	 * }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.Dictionary.some(a, onlyFoo)
	 * Llama.Dictionary.every(b, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * false
	 * true
	 * ```
	 */
	function some<D extends object>(
		dictionary: D,
		predicate: <K extends keyof D>(value: D[K], key: K) => unknown
	): boolean;

	/* Combination */
	/**
	 * Returns a new list with all of `list`'s entries flattened to `depth` or as deeply as possible if `depth` is not provided.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local dictionary = {
	 * 	foo = "foo",
	 * 	foobar = {
	 * 		bar = "bar",
	 * 		barbaz = {
	 * 			baz = "baz",
	 * 		}
	 * 	}
	 * }
	 *
	 * Llama.Dictionary.flatten(dictionary)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = "foo",
	 * 	bar = "bar",
	 * 	baz = "baz",
	 * }
	 * ```
	 */
	function flatten<D extends object>(dictionary: D, depth?: number): D;
}

type AnyList = unknown[];
/**
 * Lists are tables with index-value pairs.
 */
declare namespace List {
	/* Constructors */
	/**
	 * Creates a new list of `count` `value`s.
	 */
	function create<V>(count: number, value: V): V[];

	/* Copying */
	/**
	 * Returns a shallow copy of `list`.
	 */
	function copy<L extends AnyList>(list: L): L;

	/**
	 * Returns a deep copy of `list`.
	 *
	 * **Warning:** Deep copying is more expensive than shallow copying and forces you to resort to the more expensive `equalsDeep` for value equality checking. Only use it when absolutely necessary.
	 */
	function copyDeep<L extends AnyList>(list: L): L;

	/* Comparing */
	/**
	 * Returns whether all `lists` have shallow value equality.
	 */
	function equals(...lists: AnyList[]): boolean;

	/**
	 * Returns whether all `lists` have deep value equality.
	 *
	 * **Warning:** Deep comparison is more expensive than shallow comparison. Only use it when absolutely necessary.
	 */
	function equalsDeep(...lists: unknown[][]): boolean;

	/* Persistent changes */
	/**
	 * Returns a concatenation of all of the lists in `lists`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = { 1, 2, 3 }
	 * local b = { 4, 5, 6 }
	 *
	 * Llama.List.concat(a, b)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { 1, 2, 3, 4, 5, 6 }
	 * ```
	 * @alias `List.join`
	 */
	function concat<L, Ls extends L[]>(...lists: Ls): L[];

	/**
	 * Returns a concatenation of all of the lists in `lists`.
	 * @alias `List.concat`
	 */
	const join: typeof concat;

	/**
	 * Returns a concatenation of all of the lists in `lists` with their sublists deep copied.
	 *
	 * **Warning:** Deep concatenating is more expensive than shallow concatenating and forces you to resort to the more expensive `equalsDeep` for value equality checking. Only use it when absolutely necessary.
	 * @alias `List.joinDeep`
	 */
	function concatDeep<L, Ls extends L[]>(...lists: Ls): L[];

	/**
	 * Returns a concatenation of all of the lists in `lists` with their sublists deep copied.
	 *
	 * **Warning:** Deep concatenating is more expensive than shallow concatenating and forces you to resort to the more expensive `equalsDeep` for value equality checking. Only use it when absolutely necessary.
	 * @alias `List.concatDeep`
	 */
	const joinDeep: typeof concatDeep;

	/**
	 * Returns a new list with `values` inserted at `index` of `list`. If `index` is 0 or negative, `insert` inserts at `index` relative to the end of `list`.
	 */
	function insert<Lt, L2t>(
		list: Lt[],
		index: number,
		...values: L2t[]
	): (Lt | L2t)[];

	/**
	 * Returns copy of `list` with `values` appended to the end of `list`.
	 * @alias `List.append`
	 */
	function push<Lt, L2t>(list: Lt[], ...values: L2t[]): (Lt | L2t)[];

	/**
	 * Returns copy of `list` with `values` appended to the end of `list`.
	 * @alias `List.push`
	 */
	const append: typeof push;

	/**
	 * Returns copy of `list` with `numPops` values popped off the end of `list`.
	 */
	function pop<L extends AnyList>(list: L, numPops?: number): L;

	/**
	 * Returns a new list where the entry in `list` at `index` is removed. If `index` is 0 or negative, `removeIndex` removes at `index` relative to the end of `list`.
	 */
	function removeIndex<L extends AnyList>(list: L, index: number): L;

	/**
	 * Returns a new list where all entries in `list` at `indices` is removed. If an index is 0 or negative, `removeIndex` removes at the index relative to the end of `list`.
	 */
	function removeIndices<L extends AnyList>(list: L, ...indices: number[]): L;

	/**
	 * Returns a new list with all entries of `list` with `value` removed.
	 */
	function removeValue<L extends AnyList, V extends L[keyof L]>(
		list: L,
		value: V
	): Exclude<L, V>[];

	/**
	 * Returns a new list with all entries of `list` with any `values` removed.
	 */
	function removeValues<L extends AnyList, V extends L[keyof L][]>(
		list: L,
		...values: V
	): ExcludeMembers<L, V[keyof V]>;

	/**
	 * Returns a new list with `index` in `list` set to the `value`. If `index` is 0 or negative, `set` sets at `index` relative to the end of `list`.
	 */
	function set<Lt, V>(list: Lt[], index: number, value: V): (Lt | V)[];

	/**
	 * Returns new list with `numPlaces` values shifted off the beginning of `list`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "foo", "bar", "baz" }
	 *
	 * Llama.List.shift(list)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { "bar", "baz" }
	 * ```
	 */
	function shift<L extends AnyList>(list: L, numPlaces?: number): L;

	/**
	 * Returns new list with `values` prepended to the beginning of `list`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "baz" }
	 *
	 * Llama.List.unshift(list, "foo", "bar")
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { "foo", "bar", "baz" }
	 * ```
	 */
	function unshift<Lt, V>(list: Lt[], ...values: V[]): (Lt | V)[];

	/**
	 * Returns a new list with the entry at `index` being updated by `updater`. If the entry does not exist, `callback` is invoked and the entry is created from its return value.
	 *
	 * > `updater` and `callback` are expected to have the following signatures:
	 * > ```
	 * > updater(value, index) -> value
	 * > callback(index) -> value
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "foo", "bar" }
	 *
	 * local function fooify(value)
	 * 	return "foo" .. value
	 * end
	 *
	 * Llama.List.update(list, 2, fooify)
	 * Llama.List.update(list, 3, fooify, function()
	 * 	return "baz"
	 * end)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { "foo", "foobar" }
	 *
	 * { "foo", "bar", "baz" }
	 * ```
	 */
	function update<Lt, U, C, L = Lt[]>(
		list: L,
		index: keyof L,
		updater?: (value: L[keyof L], index: keyof L) => U,
		callback?: (index: keyof L) => C
	): Exclude<Lt | U | C, undefined>[];

	/* Sequence algorithms */
	/**
	 * Returns a new list with only the entries of `list` for which `filterer` returns a truthy.
	 *
	 * > `filterer` is expected to have the following signature:
	 * > ```
	 * > filterer(value, index) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "foo", "foo", "bar" }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.List.filter(list, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { "foo", "foo" }
	 * ```
	 */
	function filter<Lt, S extends Lt>(
		list: Lt[],
		filterer: (value: Lt, index: number) => value is S
	): S[];

	/**
	 * Returns a new list with the values of `list` mapped over using `mapper`.
	 *
	 * > `mapper` is expected to have the following signature:
	 * > ```
	 * > mapper(value, index) -> value
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "foo", "bar", "baz" }
	 *
	 * local function fooify(value)
	 * 	return "foo" .. value
	 * end
	 *
	 * Llama.List.map(list, fooify)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { "foofoo", "foobar", "foobaz" }
	 * ```
	 */
	function map<L extends AnyList, U>(
		list: L,
		mapper: (value: L[keyof L], index: keyof L) => U
	): U[];

	/**
	 * Returns a new list with the entries of `list` reversed.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { 1, 2, 3 }
	 *
	 * Llama.List.reverse(list)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { 3, 2, 1 }
	 * ```
	 */
	function reverse<L extends AnyList>(list: L): L;

	/**
	 * Returns a new list with the entries of `list` sorted by `comparator` if given. `comparator` should return `true` if the first argument should come before the second, and `false` otherwise.
	 *
	 * > `comparator` is expected to have the following signature:
	 * > ```
	 * > comparator(a, b) -> result
	 * > ```
	 */
	function sort<L extends AnyList>(
		list: L,
		comparator?: (a: L[keyof L], b: L[keyof L]) => boolean
	): L;

	/**
	 * Returns a new list of `lists` "zipped" together. The length of `list` is the length of the shortest provided list.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = { "foo", "bar", "baz" }
	 * local b = { 1, 2, 3, 4 }
	 *
	 * Llama.List.zip(a, b)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	{ "foo", 1 },
	 * 	{ "bar", 2 },
	 * 	{ "baz", 3 },
	 * }
	 * ```
	 */
	function zip<Ls extends AnyList[]>(
		...lists: Ls
	): Exclude<Ls[keyof Ls], undefined>[][];

	/**
	 * Returns a new list of `lists` "zipped" together. `zipAll` zips as much as possible, filling in `nil` values with `Llama.None`.
	 *
	 * ```lua
	 * local a = { "foo", "bar", "baz" }
	 * local b = { 1, 2, 3, 4 }
	 *
	 * Llama.List.zipAll(a, b)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	{ "foo", 1 },
	 * 	{ "bar", 2 },
	 * 	{ "baz", 3 },
	 * 	{ Llama.None, 4 },
	 * }
	 * ```
	 */
	function zipAll<Ls extends AnyList[]>(
		...lists: Ls
	): ReplaceTypeWithType<Ls[keyof Ls], undefined, LlamaNone>[][];

	/* Creating subsets */
	/**
	 * Returns a new list sliced from `list`. If `from` is not provided, `slice` slices from the beginning of `list`. If `to` is not provided, `slice` slices to the end of `list`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { 1, 2, 3, 4, 5 }
	 *
	 * Llama.List.slice(list, 1, 3)
	 * ```
	 *
	 * ```lua
	 * { 1, 2, 3 }
	 * ```
	 */
	function slice<L extends AnyList>(list: L, from?: number, to?: number): L;

	/* Reading values */
	/**
	 * Returns the first value in `list`.
	 */
	function first<Lt>(list: Lt[]): Lt;

	/**
	 * Returns the last value in `list`.
	 */
	function last<Lt>(list: Lt[]): Lt;

	/**
	 * Returns whether `list` includes a `value`.
	 */
	function includes<L extends AnyList>(list: L, value: unknown): boolean;

	/* Finding a value */
	/**
	 * Returns the first index from `from` if provided for which `list` has `value`. If `from` is 0 or negative, `find` searches from `from` relative to the end of `list`.
	 */
	function find<L extends AnyList>(
		list: L,
		value: unknown,
		from?: number
	): number | undefined;

	/**
	 * Returns the last index from `from` if provided for which `list` has `value`. If `from` is 0 or negative, `findLast` searches from `from` relative to the end of `list`.
	 */
	function findLast<L extends AnyList>(
		list: L,
		value: unknown,
		from?: number
	): number | undefined;

	/**
	 * Returns the first index from `from` if provided for which `list`'s value satisfies `predicate`. If `from` is 0 or negative, `findWhere` searches from `from` relative to the end of `list`.
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, index) -> result
	 * > ```
	 */
	function findWhere<L extends AnyList>(
		list: L,
		value: unknown,
		predicate: (value: L[keyof L], index: keyof L) => unknown,
		from?: number
	): number | undefined;

	/**
	 * Returns the last index from `from` if provided for which `list`'s value satisfies `predicate`. If `from` is 0 or negative, `findWhereLast` searches from `from` relative to the end of `list`.
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, index) -> result
	 * > ```
	 */
	function findWhereLast<L extends AnyList>(
		list: L,
		value: unknown,
		predicate: (value: L[keyof L], index: keyof L) => unknown,
		from?: number
	): number | undefined;

	/* Conversion */
	/**
	 * Returns a new set created from `list`.
	 */
	function toSet<Lt>(list: Lt[]): Set<Lt>;

	/* Reducing */
	/**
	 * Returns the number of entries in `list` for which `predicate` returns a truthy. If no predicate is provided, `count` simply counts all of the entries in `list`.
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, index) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "foo", "foo", "bar" }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.List.count(list, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * 2
	 * ```
	 */
	function count<L extends AnyList>(
		list: L,
		predicate?: (value: L[keyof L], index: keyof L) => unknown
	): number;

	/**
	 * Returns whether `predicate` returns a truthy for ***all*** of `list`'s entries.
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, index) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = { "foo", "foo" }
	 * local b = { "foo", "foo", "bar" }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.List.every(a, onlyFoo)
	 * Llama.List.every(b, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * true
	 * false
	 * ```
	 */
	function every<L extends AnyList>(
		list: L,
		predicate: (value: L[keyof L], index: keyof L) => unknown
	): boolean;

	/**
	 * Returns whether `predicate` returns a truthy for ***any*** of `list`'s entries.
	 *
	 * > `predicate` is expected to have the following signature:
	 * > ```
	 * > predicate(value, key) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = { "bar", "bar" }
	 * local b = { "foo", "bar", "baz" }
	 *
	 * local function onlyFoo(value)
	 * 	return value == "foo"
	 * end
	 *
	 * Llama.List.some(a, onlyFoo)
	 * Llama.List.some(b, onlyFoo)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * false
	 * true
	 * ```
	 */
	function some<L extends AnyList>(
		list: L,
		predicate: (value: L[keyof L], index: keyof L) => unknown
	): boolean;

	/**
	 * Reduces `list` to a single value, from left to right. If `initialReduction` is not provided, `reduce` uses the first value in `list`.
	 *
	 * > `reducer` is expected to have the following signature:
	 * > ```
	 * > reducer(reduction, value, key) -> reduction
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { 1, 2, 3 }
	 *
	 * local function add(reduction, value)
	 * 	return reduction = reduction + value
	 * end
	 *
	 * Llama.List.reduce(list, add)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * 6
	 * ```
	 */
	function reduce<L extends AnyList, R = keyof L>(
		list: L,
		reducer: (reduction: R, value: L[keyof L], key: keyof L) => R,
		initialReduction?: R
	): R;

	/**
	 * Reduces `list` to a single value, from right to left. If `initialReduction` is not provided, `reduceRight` uses the last value in `list`.
	 *
	 * > `reducer` is expected to have the following signature:
	 * > ```
	 * > reducer(reduction, value, key) -> reduction
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { 1, 2, 3 }
	 *
	 * local function subtract(reduction, value)
	 * 	return reduction = reduction - value
	 * end
	 *
	 * Llama.List.reduceRight(list, subtract)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * 0
	 * ```
	 */
	function reduceRight<L extends AnyList, R = keyof L>(
		list: L,
		reducer: (reduction: R, value: L[keyof L], key: keyof L) => R,
		initialReduction?: R
	): R;

	/* Combination */
	/**
	 * Returns a new list with all of `list`'s entries flattened to `depth` or as deeply as possible if `depth` is not provided.
	 * *Example:*
	 *
	 * ```lua
	 * local list = {
	 * 	"foo",
	 * 	{
	 * 		"bar",
	 * 		{
	 * 			"baz",
	 * 		}
	 * 	}
	 * }
	 *
	 * Llama.List.flatten(list)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { "foo", "bar", "baz" }
	 * ```
	 */
	function flatten<L extends AnyList>(list: L, depth?: number): L;

	/**
	 * Returns a new list with `values` replacing the values between `from` and `to` in `list`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "foo", 2, 3}
	 *
	 * Llama.List.splice(list, 2, 3, "bar", "baz")
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * { "foo", "bar", "baz" }
	 * ```
	 */
	function splice<Lt, V, L = Lt[]>(
		list: L,
		from: keyof L,
		to: keyof L,
		...values: V[]
	): (Lt | V)[];
}

type AnySet = Set<unknown>;

/**
 * Sets are tables where each value may only occur once.
 */
declare namespace LlamaSet {
	/* Constructors */
	/**
	 * Creates a set from `list`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local list = { "foo", "bar", "baz" }
	 *
	 * Llama.Set.fromList(list)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = true,
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 * ```
	 */
	function fromList<Lt>(list: Lt[]): Set<Lt>;

	function toList<V>(set: Set<V>): V[];

	/* Copying */
	/**
	 * Returns a shallow copy of `set`.
	 */
	function copy<S extends AnySet>(set: S): S;

	/* Comparing */
	/**
	 * Returns whether `subset` is a subset of `superset`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = {
	 * 	foo = true,
	 * 	bar = true,
	 * }
	 *
	 * local b = {
	 * 	foo = true,
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 *
	 * Llama.Set.isSubset(a, b)
	 * Llama.Set.isSubset(b, a)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * true
	 * false
	 * ```
	 */
	function isSubset<S1 extends AnySet, S2 extends AnySet>(
		subset: S1,
		superset: S2
	): boolean;

	/**
	 * Returns whether `superset` is a superset of `subset`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = {
	 * 	foo = true,
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 *
	 * local b = {
	 * 	foo = true,
	 * 	bar = true,
	 * }
	 *
	 * Llama.Set.isSuperset(a, b)
	 * Llama.Set.isSuperset(b, a)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * true
	 * false
	 * ```
	 */
	function isSuperset<S1 extends AnySet, S2 extends AnySet>(
		superset: S1,
		subset: S2
	): boolean;

	/* Persistent changes */
	/**
	 * Returns a new set with `values` added to `set`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local set = {
	 * 	foo = true,
	 * 	bar = true,
	 * }
	 *
	 * Llama.Set.add(set, "baz")
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = true,
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 * ```
	 */
	function add<Sv, V>(set: Set<Sv>, ...values: V[]): Set<Sv | V>;

	/**
	 * Returns a new set with `values` subtracted from `set`.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local set = {
	 * 	foo = true,
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 *
	 * Llama.Set.subtract(set, "baz")
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = true,
	 * 	bar = true,
	 * }
	 * ```
	 */
	function subtract<S extends AnySet>(set: S, ...values: AnyList): S;

	/**
	 * Returns a new set with all of the values of `sets` combined.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = {
	 * 	foo = true,
	 * 	bar = true,
	 * }
	 *
	 * local b = {
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 *
	 * Llama.Set.union(a, b)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foo = true,
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 * ```
	 */
	function union<Sv>(...sets: Set<Sv>[]): Set<Sv>;

	/**
	 * Returns a new set with only the values of `sets` that intersect.
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local a = {
	 * 	foo = true,
	 * 	bar = true,
	 * }
	 *
	 * local b = {
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 *
	 * Llama.Set.intersection(a, b)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	bar = true,
	 * }
	 * ```
	 */
	function intersection<Sv>(...sets: Set<Sv>[]): Set<UnionToIntersection<Sv>>;

	/* Sequence algorithms */
	/**
	 * Returns a new set with only the entries of the set for which the filterer returns a truthy.
	 *
	 * > `filterer` is expected to have the following signature:
	 * > ```
	 * > filterer(value) -> result
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local set = {
	 * 	[1] = true,
	 * 	[2] = true,
	 * 	[3] = true,
	 * 	[4] = true,
	 * 	[5] = true,
	 * }
	 *
	 * local function onlyEvens(value)
	 * 	return value % 2 == 0
	 * end
	 *
	 * Llama.Set.filter(set, onlyEvens)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	[2] = true,
	 * 	[4] = true,
	 * }
	 * ```
	 */
	function filter<Sv>(
		set: Set<Sv>,
		filterer: (value: Sv) => unknown
	): Set<Sv>;

	/**
	 * Returns a new set with the values (and keys) of `dictionary` mapped using the mapper.
	 *
	 * > `mapper` is expected to have the following signature:
	 * > ```
	 * > mapper(value) -> value
	 * > ```
	 *
	 * *Example:*
	 *
	 * ```lua
	 * local set = {
	 * 	foo = true,
	 * 	bar = true,
	 * 	baz = true,
	 * }
	 *
	 * local function fooify(value)
	 * 	return "foo" .. value
	 * end
	 *
	 * Llama.Set.map(set, fooify)
	 * ```
	 *
	 * *Results:*
	 *
	 * ```lua
	 * {
	 * 	foofoo = true,
	 * 	foobar = true,
	 * 	foobaz = true,
	 * }
	 * ```
	 */
	function map<Sv, Rv>(set: Set<Sv>, mapper: (value: Sv) => Rv): Set<Rv>;

	/* Reading values */
	/**
	 * Returns whether `set` has `value`.
	 */
	function has(set: AnySet, value: unknown): boolean;
}

declare namespace Llama {
	/**
	 * As Lua dictionaries cannot distinguish between a value not being present and a value of `nil`, `Llama.None` exists to represent values that should be interpreted as `nil`. This is especially useful when removing values with `Dictionary.merge`.
	 */
	const None: LlamaNone;
	type None = LlamaNone;

	/**
	 * Returns whether the items have reference equality.
	 */
	function equalObjects(...objects: LuaTable[]): boolean;

	/**
	 * Returns whether the table is empty.
	 */
	function isEmpty(table: LuaTable): boolean;

	export { Dictionary, List, LlamaSet as Set, None, equalObjects, isEmpty };
}

export = Llama;

/*
Steps for contributing with documentation as JSDoc:
1. Go to the raw version of llama's docs/api-reference.md
2. Copy the section in question, and format it using step 3 or manually.
3. You can run the following in your browser console:
while (true) {
	const text = prompt("Input text here:");
	if (!text) continue;
	if (text === "STOP") break;
	document.documentElement.focus();
	await window.navigator.clipboard.writeText(text.replaceAll("\n", "\n* "));
}

This prompts you for text, then converts all "\n" to "\n* ", and copies it to your clipboard.
*/
