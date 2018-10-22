import {mapObjIndexed, values} from 'ramda';
import createReducer from './createReducer';
import nest from './nest';

const fromTree = tree =>
    createReducer(
        {},
        values(
            mapObjIndexed(
                (v, k) => (typeof v === 'object' ? fromTree(v) : nest(k, v)),
                tree
            )
        )
    );

export default fromTree;
