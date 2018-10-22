import {propEq, uncurryN} from 'ramda';

const actionType = (type, transform) => (state, action) =>
    propEq('type', type, action)
        ? uncurryN(2, transform)(action.payload, state)
        : state;

export default actionType;
