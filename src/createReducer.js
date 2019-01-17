import {reduce, mergeDeepRight} from 'ramda';

const createReducer = (initialState, spec) => (state, action = {}) => {
  const desiredInitialState = reduce(
    (s, f) => mergeDeepRight(s, f(undefined, {type: '@@INIT'})),
    initialState,
    spec
  );
  const calculatedState = mergeDeepRight(desiredInitialState, state || {});

  return reduce((s, f) => f(s, action), calculatedState, spec);
};

export default createReducer;
