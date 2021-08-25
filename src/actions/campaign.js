import { FETCHCAMPAIGN, GETCAMPAIGN, CREATECAMPAIGN, UPDATECAMPAIGN, DELETECAMPAIGN, FILTERCAMPAIGN} from '../constants/campaignActionTypes';
import leadservice from '../services/leadservice';

export const fetchCampaign = () => async (dispatch) => {
    try {
        const {data} = await leadservice.getCampaigns();
        dispatch({type: FETCHCAMPAIGN, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const getCampaign = (id) => async (dispatch) => {
    try {
        const {data} = await leadservice.retriveCampaign(id);
        dispatch({type: GETCAMPAIGN, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const createCampaign = (todo) => async (dispatch) =>{
    try {
        const {data} = await leadservice.newCampaign(todo);
        dispatch({type: CREATECAMPAIGN, payload:data});
    } catch (error) {
        console.log(error.message);
        
    }
}

export const updateCampaign = (id, todo) => async (dispatch) =>{
    try {
        const {data} = await leadservice.modifyCampaign(id, todo);
        dispatch({type: UPDATECAMPAIGN, payload:data});      
    } catch (error) {
        console.log(error.message);
        
    }
}

export const deleteCampaign = (id) => async (dispatch) =>{
    try {
        await leadservice.removeCampaign(id);
        dispatch({type: DELETECAMPAIGN, payload:id});        
    } catch (error) {
        console.log(error.message);
        
    }
}

export const filterCampaign = (filter) => async (dispatch) => {
    try {
        const {data} = await leadservice.filterCampaigns(filter);
        dispatch({type: FILTERCAMPAIGN, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}