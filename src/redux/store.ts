import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  // applyMiddleware(sagaMiddleware)
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;
