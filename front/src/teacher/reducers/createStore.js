import { createStore, applyMiddleware } from "redux";
import reducer from "./root";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/sagas";

const sagaMiddleware = createSagaMiddleware();

export default createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
