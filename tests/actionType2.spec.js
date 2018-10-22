import {actionType2} from '../'

const state1 = {
    counter: 0,
};

const state2 = {
    counter: 1,
};

const action1 = {
    type: 'INC',
};

const action2 = {
    type: 'UNKNOWN',
};

const transform = state => ({
    ...state,
    counter: state.counter + 1,
});

describe('actionType2', () => {
    it('handles action', () => {
        expect(actionType2('INC', transform)(state1, action1)).toEqual(state2);
    });

    it('skips action', () => {
        expect(actionType2('INC', transform)(state1, action2)).toEqual(state1);
    });
});
