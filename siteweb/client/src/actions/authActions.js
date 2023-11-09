import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_REQUEST, LOGOUT_REQUEST, LOGOUT_SUCCESS } from "../constants/types"
import axios from '../helpers/axios'

export const login = (user) => {

    return (dispatch) => {
        dispatch({type: LOGIN_REQUEST})

        axios.post('/login', {
            ...user
        }).then((res) => {
            if (res.status == 200) {
                const {token, user} = res.data
                
                localStorage.setItem('token', token)

                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        token, user
                    }
                })
            }
        }).catch((err) => {
            console.log(err.response.data)
                dispatch({
                    type: LOGIN_FAILURE,
                    payload: { error: err.response.data.error }
                })
            })

        
    }

}

export const isUserLoggedIn = () => {

    return dispatch => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = JSON.parse(localStorage.getItem('user'));
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    token, user
                }
            })
        } else {
            dispatch({
                type: LOGIN_FAILURE,
                payload: { error: 'Failed to login' }
            })
        }
    }

}

export const signout = () => {

    return async (dispatch) => {

      dispatch({ type: LOGOUT_REQUEST });
      localStorage.clear();
      dispatch({ type: LOGOUT_SUCCESS });
      
    };
  };