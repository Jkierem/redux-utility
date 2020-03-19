import { zipObj } from 'ramda'

export const shape = (...keys) => (...values) => zipObj(keys,values);

export const nullaryActionCreator = type => () => ({ type })
export const unaryActionCreator = type => payload => ({ type, payload })
export const nAryActionCreator = (type, payloadFn) => (...values) => {
    return {
        type,
        payload: payloadFn(...values)
    }
}