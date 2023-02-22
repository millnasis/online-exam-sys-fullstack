import { combineReducers } from "redux";
// import { reducer as userMessage } from "./userMessage";

const initialState = {
  editing: "NONE",
};

export const actionsType = {
  CHANGE_EDITING: "CHANGE_EDITING",
};

export const actions = {
  change_editing(editing) {
    return {
      type: actionsType.CHANGE_EDITING,
      editing,
    };
  },
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actionsType.CHANGE_EDITING:
      return {
        ...state,
        editing: action.editing,
      };

    default:
      return state;
  }
}

export default combineReducers({
  global: reducer,
});