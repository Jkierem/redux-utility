import { add, equals as eq, evolve, toPairs } from "ramda";
import { nullaryActionCreator, unaryActionCreator } from "../../actions";
import { createReducer } from "../../reducers";

export const createListState = (options) => {
    const { 
        name,
        equals=eq,
    } = options;
    const initialState = []
    const constants = {
        add: `${name}_ADD`,
        remove: `${name}_REMOVE`,
        removeAll: `${name}_REMOVE_ALL`,
        filter: `${name}_FILTER`,
        map: `${name}_MAP`,
        set: `${name}_SET`,
        clear: `${name}_CLEAR`
    }

    const actions = evolve({
        add: unaryActionCreator,
        remove: unaryActionCreator,
        removeAll: unaryActionCreator,
        filter: unaryActionCreator,
        map: unaryActionCreator,
        set: unaryActionCreator,
        clear: nullaryActionCreator
    })(constants)

    const config = {
        [constants.add]: (state,{ payload }) => state.push(payload),
        [constants.remove]: (state,{ payload }) => {
            return state.reduce(([acc,removed],next) => {
                if( !removed && equals(next,payload) ){
                    return [ acc, true ]
                }
                return [ [...acc, next], removed]
            } ,[[], false])[0]
        },
        [constants.removeAll]: (state,{ payload }) => state.filter(x => !equals(x,payload)),
        [constants.filter]: (state,{ payload }) => state.filter(payload),
        [constants.map]: (state,{ payload }) => state.map(payload),
        [constants.set]: (_,{ payload }) => payload,
        [constants.clear]: () => [],
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

    return reducer;
}