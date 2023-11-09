import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_REQUEST, LOGOUT_SUCCESS } from "../constants/types"

const initState = {
    token: "",
    user: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    },
    authenticated: false,
    authenticating: false,
    loading: false,
    error: null,
    message: "",
};


export default (state = initState, action) => {

    console.log(action)
    
    switch(action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                authenticating: true
            }
        case LOGIN_SUCCESS:
            return {
                ...state, 
                token: action.payload.token,
                user: action.payload.user,
                authenticated: true,
                authenticating: false,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                token: "",
                user: {
                firstName: "",
                lastName: "",
                email: "",
                role: "",
                },
                authenticated: false,
                authenticating: false,
            };
            case LOGOUT_REQUEST:
                return {
                  ...state,
                  loading: true,
                };

            case LOGOUT_SUCCESS:
                state = {
                  ...initState,
                };
                
            {/*case LOGOUT_FAILURE:
                return {
                  ...state,
                  error: action.payload.error,
                  loading: false,
                };*/}
                    
        default:
            return state;
    }
}
