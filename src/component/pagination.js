const Pagination = ({currentPage, postsPerPage,totalPosts,paginate}) => {
    const pageNumbers = [];

    for(let i=1; i<=Math.ceil(totalPosts/postsPerPage); i++){
        pageNumbers.push(i);
    }

    const totlen = pageNumbers.length


    return ( 
        <nav>
            <ul className="pagination" style={{justifyContent:"center"}}>
                <li className="page-item"><button onClick={()=>paginate(1)} className="page-link">First</button></li>
                {pageNumbers.map(number =>(
                    <li key={number} className="page-item">
                        <button
                        id={`page-${number}`} 
                        onClick={()=>paginate(number)} 
                        className={`${currentPage === number ? 'page-button' : ''} page-link`}>
                            {number}
                        </button>
                    </li>
                ))}
                <li className="page-item"><button onClick={()=>paginate(totlen)} className="page-link">Last</button></li>
            </ul>
        </nav>
     );
}
 
export default Pagination;