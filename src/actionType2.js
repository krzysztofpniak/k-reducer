import {propEq, uncurryN} from 'ramda';
import {getActionTypeFromCreatorOrString} from './helpers';

const actionType2 = (type, transform) => (state, action) =>
  propEq('type', getActionTypeFromCreatorOrString(type), action)
    ? uncurryN(1, transform)(state)
    : state;

export default actionType2;
