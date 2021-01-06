import { Observable } from "rxjs";

declare module "redux-utility" {
    type Extractable<T> =  T | (() => T);
    type NullaryAction = { type: string };
    type Action = { type: string, payload?: any };
    type ActionCreator = (...args: any[]) => Action;
    type Reducer<A> = (state: A , action: Action) => A
    interface EventReducer<A> {
        on: (event: String, callback: Reducer<A>) => void
    }
    interface ReducerConfig<A> {
        [x: string]: Reducer<A>
    }
    type ReducerArray<A> = [string, (state: A, action: Action) => A][]
    type ReducerSetup<A> = (eventEmitter: EventReducer<A>) => void

    type AsyncState = {
        loading: boolean;
        data: any;
        error: any;
    } | {
        [x: string]: AsyncState;
    }
    type AsyncModule = {
        (state: AsyncState, action: Action): AsyncState;
        config: ReducerConfig<AsyncState>;
        pairs: ReducerArray<AsyncState>;
        register: ReducerSetup<AsyncState>;
        intialState: AsyncState;
        actions: {
            [key: string]: ActionCreator;
        };
        constants: {
            [key: string]: string;
        }
        extend: {
            (config: ReducerConfig<AsyncState>): Reducer<AsyncState>;
            fetch: (fn: Function) => Reducer<AsyncState>;
            success: (fn: Function) => Reducer<AsyncState>;
            error: (fn: Function) => Reducer<AsyncState>;
        };
    };

    export function nullaryActionCreator(type: string): () => NullaryAction;
    export function unaryActionCreator(type: string): (data:any) => Action;
    export function nAryActionCreator(type: string, payloadFn:(...args: any[]) => any): (...args: any[]) => Action
    export function shape(...keys: string[]) : (...values: any[]) => any;
    
    export function usePathSelector(path:string): any;
    export function usePathSelectorOr<T>(path:string, or: T): T;

    
    export function createReducer<A>(obj: ReducerConfig<A>): Reducer<A>;
    export function createPairsReducer<A>(objArr: ReducerArray<A>): Reducer<A>;
    export function createEventReducer<A>(emitter: ReducerSetup<A>): Reducer<A>;
    

    export function getDevtoolsCompose(val: boolean | (() => boolean)): any;

    export function fromActions(...creators: (Action | ActionCreator)[]): (...data: any[]) => Observable<Action>;
    export function fromActionsEager(...creators: (Action | ActionCreator)[]): Observable<Action>;

    export function createAsyncState(namespace: string, options: { nested: boolean }): AsyncModule;
}