import { combineReducers } from "redux";

const initialState = {
  userInfo: {
    // private Long st_id;
    // private String st_name;
    // private String st_sex;
    // private String st_avatar;
    // private int st_age;
    // private Date st_registerdate;
    // private String st_password;
    // private String st_card;
  },
};

export const actionsType = {
  SETTING_USER_INFO: "SETTING_USER_INFO",
  GET_USER_INFO: "GET_USER_INFO",
  RESPONSE_GET_USER_INFO: "RESPONSE_GET_USER_INFO",
};

export const actions = {
  set_user_info(userInfo) {
    return {
      type: actionsType.SETTING_USER_INFO,
      userInfo,
    };
  },
  get_user_info(st_id) {
    return {
      type: actionsType.GET_USER_INFO,
      st_id,
    };
  },
  response_user_info(userInfo) {
    return {
      type: actionsType.RESPONSE_GET_USER_INFO,
      userInfo,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.SETTING_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case actionsType.RESPONSE_GET_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };

    default:
      return state;
  }
}

export default combineReducers({
  global: reducer,
});
