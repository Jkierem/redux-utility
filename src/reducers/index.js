import { propOr, identity, compose, fromPairs } from "ramda";

export const createReducer = obj => (prevState={}, action) => propOr(
    propOr(identity,"default",obj),
    action.type,
    obj
)(prevState,action)

export const createPairsReducer = compose(createReducer, fromPairs)

export const createEventReducer = (f) => {
    const obj = {}
    f({ 
        on: (action,callback) => obj[action] = callback 
    })
    return createReducer(obj)
}