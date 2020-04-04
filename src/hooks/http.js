import { useReducer, useCallback } from 'react';

const initialState = {
    addLoading: false
    , deleteLoading: false
    , searchLoading: false
    , extra: null
    , reqIdentifier: null
    , data: null
    , error: null
}

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case 'SEND_REQUEST_ADD':
            return { ...httpState, addLoading: true, error: null, data: null, extra: null, reqIdentifier: action.reqIdentifier }
        case 'SEND_REQUEST_DELETE':
            return { ...httpState, deleteLoading: true, error: null, extra: action.extra, data: null, reqIdentifier: action.reqIdentifier }
        case 'SEND_REQUEST_SEARCH':
            return { ...httpState, searchLoading: true, error: null, data: null }
        case 'RESPONSE_ADD':
            return { ...httpState, addLoading: false, data: action.responseData, extra: action.extra }
        case 'RESPONSE_DELETE':
            return { ...httpState, deleteLoading: false, data: action.responseData, extra: action.extra }
        case 'RESPONSE_SEARCH':
            return { ...httpState, searchLoading: false, data: action.responseData }
        case 'ERROR_ADD':
            return { ...httpState, addLoading: false, error: action.error }
        case 'ERROR_DELETE':
            return { ...httpState, deleteLoading: false, error: action.error }
        case 'ERROR_SEARCH':
            return { ...httpState, searchLoading: false, error: action.error }
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('aq ra gindaa!!!');
    }
}



const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const sendRequest = useCallback((url, reqType, resType, errorType, method, extra, body = null) => {
        dispatchHttp({ type: reqType, reqIdentifier: reqType, extra: extra });
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-type': 'application/json'
            }
        }).then(response => {
            return response.json();
        }).then(response => {
            dispatchHttp({ type: resType, responseData: response, extra: extra });
            //dispatchIng({ type: 'DELETE', id: id });
        }).catch(error => {
            dispatchHttp({ type: errorType, error: error.message });
        });
    }, []);

    const clear = useCallback(() => {
        dispatchHttp({ type: 'CLEAR' });
    }, []);

    return {
        addLoading: httpState.addLoading,
        deleteLoading: httpState.deleteLoading,
        searchLoading: httpState.searchLoading,
        extra: httpState.extra,
        reqIdentifier: httpState.reqIdentifier,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        clear: clear
    }
}

export default useHttp;