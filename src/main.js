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

/**
 * Applies a function to the value at the given index of an array, returning a
 * new copy of the array with the element at the given index replaced with the
 * result of the function application.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig Number -> (a -> a) -> [a] -> [a]
 * @param {Number} idx The index.
 * @param {Function} fn The function to apply.
 * @param {Array|Arguments} list An array-like object whose value
 *        at the supplied index will be replaced.
 * @return {Array} A copy of the supplied array-like object with
 *         the element at index `idx` replaced with the value
 *         returned by applying `fn` to the existing element.
 * @see R.update
 * @example
 *
 *      R.adjust(1, R.toUpper, ['a', 'b', 'c', 'd']);      //=> ['a', 'B', 'c', 'd']
 *      R.adjust(-1, R.toUpper, ['a', 'b', 'c', 'd']);     //=> ['a', 'b', 'c', 'D']
 * @symb R.adjust(-1, f, [a, b]) = [a, f(b)]
 * @symb R.adjust(0, f, [a, b]) = [f(a), b]
 */
const root = (type, subReducer) => (state, action) => {
    const prefix = `${type}.`;
    if (compose(startsWith(prefix), prop('type'))(action)) {
        const unwrappedAction = {
            ...action,
            type: action.type.substr(prefix.length),
        };
        return subReducer(state, unwrappedAction);
    } else {
        return state;
    }
};

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
        if (types.some(type => ~type.toString().indexOf('.'))) { // eslint-disable-line
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

export {createReducer, actionType, actionType2, action, nest, root, forwardTo};
