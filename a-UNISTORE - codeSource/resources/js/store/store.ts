import { createStore, combineReducers } from 'redux';
import { attributesReducer } from './reducers/AttributesReducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => any;
  }
}

const rootReducer = combineReducers({
  attributes: attributesReducer,
});

const store = createStore(
  rootReducer,
  // Only use the extension if it exists
  (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

export default store;
