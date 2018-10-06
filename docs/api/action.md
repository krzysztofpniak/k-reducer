### `action(matcher, transform)`

Creates an isolated `reducer` defined by `subReducer` in `type` scope in state.

- `matcher: action -> bool`

- `transform: payload -> state -> state` - transform specification

#### Example

In the following example, we nest a form reducer.

```javascript
import {createReducer, nest,} from `k-reducer`;
import {propEq, assoc,} from 'ramda';

const initialState = {
    title: '',
    counter: 0,
};

const reducer = createReducer(
    initialState,
    [
        action(propEq('type', 'SET_TITLE'), assoc('title')),
        action(propEq('type', 'INC'), compose(over(lensProp('counter')), add)),
    ]
);

```
