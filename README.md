<h1 align="center">📚 Llama 🦙</h1>
<div align="center">
Lua Library for Immutable Data
</div>

TS typings for Frelerik's "Llama" library. Some useful links:

-   **[Llama repository](https://github.com/Frelerik/llama/)**
-   **[Llama documentation](https://frelerik.github.io/llama/)**
-   **[This package's repository](https://github.com/tacheometry/rbxts-llama/)**

<h2>Installation</h2>

[![NPM](https://nodei.co/npm/@rbxts/llama.png)](https://npmjs.org/package/@rbxts/llama)

Run `npm i @rbxts/llama` in your project directory.

<h2>Usage</h2>

After importing the library, you can use any utility from [the documentation](https://frelerik.github.io/llama/) in TS.

<h3>Llama data types for TS</h3>

-   Dictionaries are objects _`{}`_
-   Lists are arrays _`T[]`_
-   Sets are interpreted as JS Sets _`new Set<T>`_
    -- In roblox-ts, a `Set<number>` whose added values are `1` and `5` is just a table that looks like:
    `lua { [1] = true, [5] = true } `

<h3>Importing</h3>

```ts
import Llama from "@rbxts/llama";
```

or

```ts
import { Dictionary, List, Set } from "@rbxts/llama";
```

---

If you would like to contribute to Llama, please file Pull Requests and Issues in [its GitHub repository](https://github.com/Frelerik/llama/), and not in the repository of this package.
