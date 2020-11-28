import { Observable } from "rxjs";

declare module "redux-utility" {
    export type Extractable<T> =  T | (() => T);
    export type NullaryAction = { type: string };
    export type Action = { type: string, payload?: any };
    export type ActionCreator = (...args: any[]) => Action;
    export type Reducer<A> = (state: A , action: Action) => A
    export interface EventReducer<A> {
        on: (event: String, callback: Reducer<A>) => void
    }
    export interface ReducerConfig<A> {
        [x: string]: Reducer<A>
    }
    export type ReducerArray<A> = [string, (state: A, action: Action) => A][]
    export type ReducerSetup<A> = (eventEmitter: EventReducer<A>) => void

    export type AsyncState = FlatAsyncState | NestedAsyncState;

    export type FlatAsyncState = {
        loading: boolean;
        data: any;
        error: any;
        [x: string]: any
    }

    export type NestedAsyncState = {
        [x: string]: AsyncState;
    }

    export type AsyncModule = {
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
    export function shape(...keys: (string | number | symbol)[]) : (...values: any[]) => any;
    
    export function usePathSelector<T>(path:string, or:T): T;

    
    export function createReducer<A>(obj: ReducerConfig<A>): Reducer<A>;
    export function createPairsReducer<A>(objArr: ReducerArray<A>): Reducer<A>;
    export function createEventReducer<A>(emitter: ReducerSetup<A>): Reducer<A>;

    export function getDevtoolsCompose(val: Extractable<boolean>): any;

    export function fromActions(...creators: (Action | ActionCreator)[]): (...data: any[]) => Observable<Action>;
    export function fromActionsEager(...creators: (Action | ActionCreator)[]): Observable<Action>;

    export function createAsyncState(namespace: string, options?: { nested: boolean }): AsyncModule;
}