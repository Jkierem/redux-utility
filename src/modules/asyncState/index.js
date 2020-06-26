import { evolve, merge, toPairs, reduce, prop } from "ramda";
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

const composeReducers = (...reducers) => (state,action) => reduce(
    (accState,nextReducer) => nextReducer(accState,action) , state
)(reducers)

const nested = prop("nested")

export const createAsyncState = (ns, options) => {
    const NS = ns.toUpperCase()

    const initalState = init(ns,nested(options))

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
        [constants.fetch]: composeReducers(
            setFromConstant("loading",true,reducerOptions),
            setFromConstant("data"   ,undefined,reducerOptions),
            setFromConstant("error"  ,undefined,reducerOptions),
        ),
        [constants.success]: composeReducers(
            setFromConstant("loading",false,reducerOptions),
            setFromConstant("error"  ,undefined,reducerOptions),
            setFromPayload("data"    ,reducerOptions),
        ),
        [constants.error]: composeReducers(
            setFromConstant("loading",true,reducerOptions),
            setFromConstant("data"   ,undefined,reducerOptions),
            setFromPayload("error"  ,reducerOptions),
        ),
        default: merge(initalState)
    }
    const pairs = toPairs(config)
    const register = red => {
        pairs.forEach(([type, fn]) => {
            red.on(type,fn)
        })
    }

    const reducer = createReducer(config)
    reducer.initalState = initalState;
    reducer.constants = constants;
    reducer.register = register;
    reducer.actions = actions;
    reducer.config = config;
    reducer.pairs = pairs;
    return reducer;
}