import { compose } from 'redux'
import { extract } from '../_internal'

export const getDevtoolsCompose = (shouldUse) => {
    if(extract(shouldUse)) {
        return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    } else {
        return compose;
    }
}