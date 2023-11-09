import { combineReducers } from "redux";
import authReducer from "./authReducer";

const routReducer = combineReducers({
  auth: authReducer,
});

export default routReducer;
