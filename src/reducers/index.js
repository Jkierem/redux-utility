import { propOr, identity, compose, fromPairs } from "ramda";

const defaultCase = propOr(identity,"default")
const actionType =  propOr("","type")

export const createReducer = obj => (prevState={}, action) => propOr(
    defaultCase(obj),
    actionType(action),
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