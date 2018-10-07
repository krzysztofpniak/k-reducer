import {action} from '../'

const state1 = {
    counter: 0,
};

const state2 = {
    counter: 1,
};

const action1 = {
    type: 'INC_BY',
    payload: 1
};

const action2 = {
    type: 'UNKNOWN',
    payload: 1
};

const transform = (payload, state) => ({
    ...state,
    counter: state.counter + payload,
});

describe('action', () => {
    it('handles action', () => {
        expect(
            action(
                a => a.type === 'INC_BY',
                transform
            )(state1, action1)
        ).toEqual(state2)
    });

    it('skips action', () => {
        expect(
            action(
                a => a.type === 'INC_BY',
                transform
            )(state1, action2)
        ).toEqual(state1)
    });
});
