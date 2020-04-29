import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false, 
    error: null,
    data: null,
    extra: null,
    identifier: null
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
        fetch(url, {
            method: method,
            body: body,
            headers: { 'Content-Type': 'application/json' }
          }).then(response => {
            return response.json();
          }).then(responseData => {
            dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra: reqExtra });
          }).catch(error => {
            dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
          });
    }, []);

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        sendRequest: sendRequest,
        clear: clear
    };
};

const httpReducer = (currHttpState, action) => {
    switch (action.type) {
      case 'SEND': return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
      case 'RESPONSE': return { ...currHttpState, loading: false, data: action.responseData, extra: action.extra };
      case 'ERROR': return { loading: false, error: action.errorMessage };
      case 'CLEAR': return initialState;
      default : throw new Error('Should not be reached!');
    }
  }

export default useHttp;