const posts = (posts = [], action) => {
    switch (action.type) {
        case 'FETCHALL':
            return action.payload;
        case 'CREATE':
            return [...posts, action.payload];
        case 'UPDATE':
            return posts.map((post) => post._id === action.payload ? action.payload : post);
        case 'DELETE':
            return posts.filter((post) => post._id !== action.payload);
        case 'FILTER':
            return action.payload;
        default:
            return posts;
    }
}

export default posts;