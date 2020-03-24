import { is, apply, __, ifElse, identity } from "ramda"

export const extractWith = (data) => (value) => ifElse(
    is(Function), 
    apply(__,data), 
    identity
)(value)

export const extract = (value) => extractWith([])(value)