import {compose, lensProp, prop, set, startsWith, view} from 'ramda';

const nest = (type, subReducer) => (state, action) => {
  const prefix = `${type}.`;
  const subState = view(lensProp(type), state);
  const initializedState = subState
    ? state
    : set(lensProp(type), subReducer(undefined, {type: '@@NEST_INIT'}), state);

  if (
    compose(
      startsWith(prefix),
      prop('type')
    )(action)
  ) {
    const unwrappedAction = {
      ...action,
      type: action.type.substr(prefix.length),
    };

    const newSubState = subReducer(subState, unwrappedAction);

    return newSubState !== subState
      ? set(lensProp(type), newSubState, initializedState)
      : initializedState;
  } else {
    return initializedState;
  }
};

export default nest;
