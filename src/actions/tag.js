import { FETCHTAG, GETTAG, CREATETAG, UPDATETAG, DELETETAG, FILTERTAG} from '../constants/tagActionTypes';
import leadservice from '../services/leadservice';

export const fetchTag = () => async (dispatch) => {
    try {
        const {data} = await leadservice.getTags();
        dispatch({type: FETCHTAG, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const getTag = (id) => async (dispatch) => {
    try {
        const {data} = await leadservice.retriveTag(id);
        dispatch({type: GETTAG, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const createTag = (post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.newTag(post);
        dispatch({type: CREATETAG, payload:data});
    } catch (error) {
        console.log(error.message);
        
    }
}

export const updateTag = (id, post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.modifyTag(id, post);
        dispatch({type: UPDATETAG, payload:data});       
    } catch (error) {
        console.log(error.message);
        
    }
}

export const deleteTag = (id) => async (dispatch) =>{
    try {
        await leadservice.removeTag(id);
        dispatch({type: DELETETAG, payload:id});        
    } catch (error) {
        console.log(error.message);
        
    }
}

export const filterTag = (filter) => async (dispatch) => {
    try {
        const {data} = await leadservice.filterTags(filter);
        dispatch({type: FILTERTAG, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}
