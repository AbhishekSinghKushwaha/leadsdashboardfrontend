import { AUTH } from '../constants/authActionTypes';
import leadservice from '../services/leadservice';

export const signin = (formData, history) => async (dispatch) => {
    try {
        const { data } = await leadservice.signIn(formData);

        dispatch({type: AUTH, data});

        history.push('/');
    } catch (error) {
        console.log(error.message);
    }
}

export const signup = (formData, history) => async (dispatch) => {
    try {
        const {data} = await leadservice.signUp(formData);

        dispatch({type: AUTH, data});

        history.push('/');
    } catch (error) {
        console.log(error.message);
    }
}