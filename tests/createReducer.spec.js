import { createReducer } from '../'

const initialModel1 = {
    a: 1,
};

const action1 = {
    type: 'test',
    payload: 1
};

describe('createReducer', () => {
    describe('createReducer', () => {
        it('accepts empty reducer', () => {
            expect(
                createReducer(
                    initialModel1,
                    []
                )(initialModel1, action1)
            ).toBe(initialModel1)
        });
    })
});
