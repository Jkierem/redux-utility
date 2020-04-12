# Redux Utility Toolbelt

This a Redux utilities library for alternate approaches to creating all the redux boilerplate. It uses ramda under the hood for most of the utilities.

## Install

```bash
yarn add redux-utility
# or
npm install redux-utility
```

## Migration from 1.x to 2.x

Since exports were reorganized, all that is needed is to update exports. Change this

```javascript
import { Reducers } from 'redux-utility'

const { createReducer } = Reducers;
```

to

```javascript
import { createReducer } from 'redux-utility'
```

## Usage

The functions in the library are divided into 4 categories:

- Actions
- Hooks
- Reducers
- Redux
- Observable

Every function inside each module is exported as a named export. A plan for rxjs like imports is on the way

### Actions

The Actions object contains functions for creating action creators.

```javascript
import { 
    nullaryAction,
    unaryActionCreator,
    nAryActionCreator,
    shape
} from 'redux-utility'
```

#### nullaryActionCreator

Creates an action creator with no arguments, given the type

```javascript
const inc = nullaryActionCreator("INC")
inc() // returns { type: "INC" }
```

#### unaryActionCreator

Creates an action creator that receives a single argument, given the type

```javascript
const withPayload = unaryActionCreator("WITH_PAYLOAD");
withPayload(42) // returns { type: "WITH_PAYLOAD" , payload: 42 }
```

#### nAryActionCreator

Creates an action creator given the type and a payload constructor. Payload is constructed by calling the payload function with the given arguments

```javascript
const withTwoArgs = nAryActionCreator("ADD",(a,b) => ({ a,b }))
withTwoArgs(20,22) // returns { type: "ADD" , payload: { a: 20, b: 22 } }
```

#### shape
 
Shape is a simple utility added for the most common case shape receives the names of the object keys and returns a function that constructs objects based on argument position

```javascript
const ABShape = shape('a','b')
ABShape(1,2) // returns { a: 1, b: 2 }

const withAB = nAryActionCreator("ADD", ABShape)
withAB(20,22) // returns { type: "ADD" , payload: { a: 20, b: 22 } }
```

### Hooks

```javascript
import { 
    usePathSelector 
} from 'redux-utility'
```

#### usePathSelector

The hook receives a dot separated path and a default value and returns a piece of state

```javascript
// state = { a : { b: { c: 42 } } }

usePathSelector("a.b.c") // returns 42
usePathSelector("a.b.d") // returns undefined
usePathSelector("a.b.d",50) // returns 50
```

### Reducers

Contains various functions that create reducers through different styles

```javascript
import { 
    createReducer,
    createPairsReducer, 
    createEventReducer  
} from 'redux-utility'
```

#### createReducer

Receives a configuration object and creates a reducer based on the object. Uses the keys as action types and calls the value associated with the key. Also a special 'default' key is reserved for when no action is handled. The default value for the default key is the identity function

```javascript
const DEC = 'DEC'
const INC = 'INC'

const reducer = createReducer({
    [DEC]: (state,action) => state - 1,
    [INC]: (state,action) => state + 1,
    // default: (state) => state
})

const dec = nullaryActionCreator(DEC)
const inc = nullaryActionCreator(INC)

reducer(5,dec()) // returns 4
reducer(5,inc()) // returns 6
reducer(5, {type: "anything"}) // returns 5
```

#### createPairsReducer

Creates a reducer based on an array of (actionType, function) pairs. Converts the array to an object and calls createReducer. Keep in mind that the array is not validated and must conform to a valid object.

```javascript
const DEC = 'DEC'
const INC = 'INC'

const reducer = createPairsReducer([
    [DEC, (state,action) => state - 1],
    [INC, (state,action) => state + 1],
    // ["default", (state) => state]
])

const dec = nullaryActionCreator(DEC)
const inc = nullaryActionCreator(INC)

reducer(5,dec()) // returns 4
reducer(5,inc()) // returns 6
reducer(5, {type: "anything"}) // returns 5
```

#### createEventReducer

Creates a reducer based on a function that receives an object with a similar interface of that of NodeJS Event Emitters, where events are action types. Has a default event for handling the default case.

```javascript
const DEC = 'DEC'
const INC = 'INC'

const reducer = createEventReducer(reducer =>
    reducer.on(DEC, (state,action) => state - 1)
    reducer.on(INC, (state,action) => state + 1)
    // reducer.on("default", (state) => state)
])

const dec = nullaryActionCreator(DEC)
const inc = nullaryActionCreator(INC)

reducer(5,dec()) // returns 4
reducer(5,inc()) // returns 6
reducer(5, {type: "anything"}) // returns 5
```

### Redux

Contains general redux utilities

```javascript
import {
    getDevtoolsCompose
} from 'redux-utility'
```

#### getDevtoolsCompose

Returns the redux devtools compose if it exist. Otherwise returns redux compose. The function may receive an argument that when false, forces the function to return redux's compose. This could be a function or a boolean value. Common usage:

```javascript
const shouldUseDevtool = () => process.env.NODE_ENV === "development"
const composeEnhancers = getDevtoolsCompose(shouldUseDevtool)

const store = createStore(
    reducer,
    initialState,
    composeEnhancers(...enhancers)
)
```

### Observable

Contains utilities to use with redux-observable

```javascript
import {
    fromActions,
    fromActionsEager
} from 'redux-utility'
```

#### fromActions

Creates an observable creator function from the given action creators. The observable created emits the actions in the given order by passing the given arguments to the action creators. Useful when a piece of state is needed or the actions have a payload. When the emitted actions have no needed payload, it is commonly better to use the eager version of this utility. 

```javascript
const DEC = 'DEC'
const INC = 'INC'

const reducer = createReducer({
    [DEC]: (state,action) => state - action.payload,
    [INC]: (state,action) => state + action.payload,
})

const inc = unaryActionCreator("INC")
const dec = unaryActionCreator("DEC")

const obs = fromActions( inc, dec )(5)
// --- inc(5) --- dec(5) |--->

// Common usage
const epic = actions$ => actions$.pipe(
    ofType("START"),
    map(() => 5)
    mergeMap(
        fromActions(
            inc,
            dec
        ) // returns the same as fromActions( inc, dec )(5)
    )
)
```

#### fromActionsEager

Eager version of fromActions. Creates an action observable from the given action creators by calling them with no arguments. Similar to calling rxjs Observable.from with an array of actions.

```javascript
const DEC = 'DEC'
const INC = 'INC'

const reducer = createReducer({
    [DEC]: (state,action) => state - 1,
    [INC]: (state,action) => state + 1,
})

const inc = nullaryActionCreator("INC")
const dec = nullaryActionCreator("DEC")

const obs = fromActionsEager( inc, dec )
// --- inc() --- dec() |--->

// Common usage
const epic = actions$ => actions$.pipe(
    ofType("START"),
    mergeMap(() =>
        fromActionsEager(
            inc,
            dec
        ) // returns the same as fromActionsEager( inc, dec )
    )
)
```