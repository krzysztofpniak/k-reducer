import {compose, lensProp, over, prop, set, startsWith, view} from 'ramda';

const nest = (type, subReducer) => (state, action) => {
    const prefix = `${type}.`;
    const subState = view(lensProp(type), state);
    const initializedState = subState
        ? state
        : set(
              lensProp(type),
              subReducer(undefined, {type: '@@NEST_INIT'}),
              state
          );

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
        return over(
            lensProp(type),
            subState => subReducer(subState, unwrappedAction),
            initializedState
        );
    } else {
        return initializedState;
    }
};

export default nest;
