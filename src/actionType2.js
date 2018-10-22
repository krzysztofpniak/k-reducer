import {propEq, uncurryN} from 'ramda';

const actionType2 = (type, transform) => (state, action) =>
    propEq('type', type, action) ? uncurryN(1, transform)(state) : state;

export default actionType2;
