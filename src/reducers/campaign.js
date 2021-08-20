const campaigns = (campaigns = [], action) => {
    switch (action.type) {
        case 'FETCHCAMPAIGN':
            return action.payload;
        case 'CREATECAMPAIGN':
            return [...campaigns, action.payload];
        case 'UPDATECAMPAIGN':
            return campaigns.map((camp) => camp._id === action.payload ? action.payload : camp);
        case 'DELETECAMPAIGN':
            return campaigns.filter((camp) => camp._id !== action.payload);
        case 'FILTERCAMPAIGN':
            return action.payload;
        default:
            return campaigns;
    }
}

export default campaigns;