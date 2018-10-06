import { compose, lensProp, over, prop, propEq, reduce, set, startsWith, uncurryN, view } from 'ramda';

var createReducer = function createReducer(initialState, spec) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return reduce(function (s, f) {
            return f(s, action);
        }, state, spec);
    };
};

var actionType = function actionType(type, transform) {
    return function (state, action) {
        return propEq('type', type, action) ? uncurryN(2, transform)(action.payload, state) : state;
    };
};

var actionType2 = function actionType2(type, transform) {
    return function (state, action) {
        return propEq('type', type, action) ? uncurryN(1, transform)(state) : state;
    };
};

var action = function action(matcher, transform) {
    return function (state, action) {
        return matcher(action) ? uncurryN(2, transform)(action.payload, state) : state;
    };
};

var root = function root(type, subReducer) {
    return function (state, action) {
        var prefix = type + '.';
        if (compose(startsWith(prefix), prop('type'))(action)) {
            var unwrappedAction = Object.assign({}, action, {
                type: action.type.substr(prefix.length)
            });
            return subReducer(state, unwrappedAction);
        } else {
            return state;
        }
    };
};

var nest = function nest(type, subReducer) {
    return function (state, action) {
        var prefix = type + '.';
        var subState = view(lensProp(type), state);
        var initializedState = subState ? state : set(lensProp(type), subReducer(undefined, { type: '@@NEST_INIT' }), state);

        if (compose(startsWith(prefix), prop('type'))(action)) {
            var unwrappedAction = Object.assign({}, action, {
                type: action.type.substr(prefix.length)
            });
            return over(lensProp(type), function (subState) {
                return subReducer(subState, unwrappedAction);
            }, initializedState);
        } else {
            return initializedState;
        }
    };
};

var wrapAction = function wrapAction(action) {
    for (var _len = arguments.length, types = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        types[_key - 1] = arguments[_key];
    }

    if (types.length === 0) {
        return action;
    } else {
        if (types.some(function (type) {
            return ~type.toString().indexOf('.');
        })) {
            // eslint-disable-line
            throw new Error('Action type can\'t contain a dot');
        }

        return Object.assign({}, action, {
            type: types.join('.') + '.' + action.type
        });
    }
};

var forwardTo = function forwardTo(dispatch) {
    for (var _len2 = arguments.length, types = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        types[_key2 - 1] = arguments[_key2];
    }

    if (types.length === 0) {
        return dispatch;
    } else {
        return function (action) {
            return dispatch(wrapAction.apply(undefined, [typeof action === 'function' ? action.apply(undefined, types) : action].concat(types)));
        };
    }
};

export { createReducer, actionType, actionType2, action, nest, root, forwardTo };
