const tags = (tags = [], action) => {
    switch (action.type) {
        case 'FETCHTAG':
            return action.payload;
        case 'CREATETAG':
            return [...tags, action.payload];
        case 'UPDATETAG':
            return tags.map((tag) => tag._id === action.payload ? action.payload : tag);
        case 'DELETETAG':
            return tags.filter((tag) => tag._id !== action.payload);
        case 'FILTERTAG':
            return action.payload;
        default:
            return tags;
    }
}

export default tags;