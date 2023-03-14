import { put, take, call } from "redux-saga/effects";
import axios from "axios";

import { actionsType, actions } from "../reducers/root";
import constant from "../../constant";

export function* getUserInfo() {
  while (true) {
    const action = yield take(actionsType.GET_USER_INFO);
    const response = yield call(axios.get, "/students/" + action.st_id);
    if (response && response.status === 200) {
      const result = response.data;
      if (result.code === constant.code.success) {
        localStorage.setItem("userinfo", JSON.stringify(result.data));
        yield put(actions.response_user_info(result.data));
      }
    }
  }
}
