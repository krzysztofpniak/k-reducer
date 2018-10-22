import {reduce, merge} from 'ramda';

const createReducer = (initialState, spec) => (state, action = {}) => {
    const calculatedState =
        state ||
        reduce(
            (s, f) => merge(s, f(undefined, {type: '@@INIT'})),
            initialState,
            spec
        );
    return reduce((s, f) => f(s, action), calculatedState, spec);
};

export default createReducer;
