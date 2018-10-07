import {
    compose,
    prop,
    propEq,
    reduce,
    startsWith,
    over,
    lensProp,
    uncurryN,
    view,
    set,
} from "ramda";

const createReducer = (initialState, spec) =>
    (state = initialState, action = {}) =>
        reduce((s, f) => f(s, action), state, spec);

const actionType = (type, transform) => (state, action) => propEq('type', type, action) ? uncurryN(2, transform)(action.payload, state) : state;

const actionType2 = (type, transform) => (state, action) => propEq('type', type, action) ? uncurryN(1, transform)(state) : state;

const action = (matcher, transform) => (state, action) => matcher(action) ? uncurryN(2, transform)(action.payload, state) : state;

const nest = (type, subReducer) => (state, action) => {
    const prefix = `${type}.`;
    const subState = view(lensProp(type), state);
    const initializedState = subState ? state : set(lensProp(type), subReducer(undefined, {type: '@@NEST_INIT'}), state);

    if (compose(startsWith(prefix), prop('type'))(action)) {
        const unwrappedAction = {
            ...action,
            type: action.type.substr(prefix.length),
        };
        return over(lensProp(type), subState => subReducer(subState, unwrappedAction), initializedState);
    } else {
        return initializedState;
    }
};

const wrapAction = (action, ...types) => {
    if (types.length === 0) {
        return action;
    } else {
        if (types.some(type => type.indexOf('.') !== -1)) { // eslint-disable-line
            throw new Error('Action type can\'t contain a dot');
        }

        return {
            ...action,
            type: `${types.join('.')}.${action.type}`
        };
    }
};

const forwardTo = (dispatch, ...types) => {
    if (types.length === 0) {
        return dispatch;
    } else {
        return action => dispatch(wrapAction(typeof action === 'function' ? action(...types) : action, ...types));
    }
};

export {createReducer, actionType, actionType2, action, nest, wrapAction, forwardTo};
