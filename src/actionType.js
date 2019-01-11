import {propEq, uncurryN} from 'ramda';
import {getActionTypeFromCreatorOrString} from './helpers';

const actionType = (type, transform) => (state, action) =>
  propEq('type', getActionTypeFromCreatorOrString(type), action)
    ? uncurryN(2, transform)(action.payload, state)
    : state;

export default actionType;
