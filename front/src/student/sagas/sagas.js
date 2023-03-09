import { fork } from "redux-saga/effects";

import { getUserInfo } from "./userInfoSagas";

export default function* rootSaga() {
  yield fork(getUserInfo);
}
