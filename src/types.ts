interface Loading {
    status: 'loading';
}
interface Error<E> {
    status: 'error';
    error: E;
}
interface Success<S> {
    status: 'success';
    data: S;
}
export type Request<S, E> = Loading | Success<S> | Error<E>;