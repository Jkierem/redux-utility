import { evolve, merge, toPairs, reduce, prop, propOr, identity } from "ramda";
import { nullaryActionCreator, unaryActionCreator } from "../../actions";
import { createReducer } from '../../reducers'

const init = (ns,nested) => {
    const initial = {
        loading: false,
        data: undefined,
        error: undefined
    }
    return nested ? {
        [ns]: initial
    } : initial
}

const setFromPayload = (att,{ns,nested}) => (state,{ payload }) => {
    if(nested){
        return {
            ...state,
            [ns]:{
                ...state[ns],
                [att]: payload
            }
        }
    } else {
        return {
            ...state,
            [att]: payload
        }
    }
}

const setFromConstant = (att,value,{ns,nested}) => (state) => {
    if(nested){
        return {
            ...state,
            [ns]:{
                ...state[ns],
                [att]: value
            }
        }
    } else {
        return {
            ...state,
            [att]: value
        }
    }
}

const pipeReducers = (...reducers) => (state,action) => reduce(
    (accState,nextReducer) => nextReducer(accState,action) , state
)(reducers)

const enhance = reducer => fn => pipeReducers(reducer,fn)

const nested = prop("nested")
const propOrIdentity = propOr(identity)

export const createAsyncState = (ns, options) => {
    const NS = ns.toUpperCase()

    const initialState = init(ns,nested(options))

    const constants = {
        fetch: `${NS}_FETCH`,
        success: `${NS}_SUCCESS`,
        error: `${NS}_ERROR`
    }

    const actions = evolve({
        fetch: nullaryActionCreator,
        success: unaryActionCreator,
        error: unaryActionCreator
    })(constants)

    const reducerOptions = {
        ns, 
        nested: nested(options)
    }
    const config = {
        [constants.fetch]: pipeReducers(
            setFromConstant("loading",true,reducerOptions),
            setFromConstant("data"   ,undefined,reducerOptions),
            setFromConstant("error"  ,undefined,reducerOptions),
        ),
        [constants.success]: pipeReducers(
            setFromConstant("loading",false,reducerOptions),
            setFromConstant("error"  ,undefined,reducerOptions),
            setFromPayload("data"    ,reducerOptions),
        ),
        [constants.error]: pipeReducers(
            setFromConstant("loading",true,reducerOptions),
            setFromConstant("data"   ,undefined,reducerOptions),
            setFromPayload("error"  ,reducerOptions),
        )
    }
    const pairs = toPairs(config)
    const register = red => {
        pairs.forEach(([type, fn]) => {
            red.on(type,fn)
        })
    }

    const reducer = createReducer(config)
    reducer.initialState = initialState;
    reducer.constants = constants;
    reducer.register = register;
    reducer.actions = actions;
    reducer.config = config;
    reducer.pairs = pairs;
    reducer.extend = (overrides) => {
        return createReducer({
            [constants.fetch]: pipeReducers(
                config[constants.fetch],
                propOrIdentity("fetch",overrides)
            ),
            [constants.success]: pipeReducers(
                config[constants.success],
                propOrIdentity("success",overrides)
            ),
            [constants.error]: pipeReducers(
                config[constants.error],
                propOrIdentity("error",overrides)
            ),
        })
    }
    reducer.extend.fetch = enhance(config[constants.fetch]);
    reducer.extend.success = enhance(config[constants.success]);
    reducer.extend.error = enhance(config[constants.error]);
    return reducer;
}