### `nest(type, subReducer)`

Creates an isolated `reducer` defined by `subReducer` in `type` scope in state.

- `type: String`

- `subReducer: reducer` - reducer specification

#### Example

In the following example, we nest a form reducer.

```javascript
import { createReducer, nest, } from `k-reducer`;

const reducer = createReducer(
    {},
    [
        nest('form', formReducer),
    ]
);

```

#### See also
* [createReducer](createReducer.md)
