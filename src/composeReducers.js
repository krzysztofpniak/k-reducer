import {reduce, merge} from 'ramda';

const composeReducers = (...reducers) => (state, action) => {
  if (state) {
    return reduce((s, reducer) => reducer(s, action), state, reducers);
  } else {
    return reduce(
      (s, reducer) => merge(s, reducer(undefined, action)),
      undefined,
      reducers
    );
  }
};

export default composeReducers;
