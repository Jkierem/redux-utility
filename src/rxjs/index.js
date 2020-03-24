import { of } from 'rxjs'
import { extractWith, extract } from '../_internal'

export const fromActions = (...action) => (...data) => of(...action.map(extractWith(data)))
export const fromActionsEager = (...actions) => of(...actions.map(extract))