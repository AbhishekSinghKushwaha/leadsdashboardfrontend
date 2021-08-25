import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import './tag.css'

import { Link } from "react-router-dom";
import Pagination from '../../pagination';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import {fetchTag, createTag, updateTag, deleteTag, filterTag} from '../../../actions/tag';
import leadservice from '../../../services/leadservice';

const Tags = () => {

    let emptyTag = {
        tagName: '',
        tagDescription:''
    };

    const emptyFilter = {
        ftag:"",
    }

    const [tags, setTags] = useState(emptyTag);

    const [filter, setfilter] = useState(emptyFilter);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));
    const getTags = useSelector((state)=>state.tags);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = getTags.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const dispatch = useDispatch();
    const [refreshKey, setRefreshKey] = useState(0);
    const posts = useSelector((state)=>state.posts);                

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(filterTag(filter));
      }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setTags({ ...tags, [name]: value });
    };

    const handleFilter = event => {
        const { name, value } = event.target;
        setfilter({ ...filter, [name]: value });
      };

    const filterReset = () => {
        setfilter({
            ftag:"",
        })
    }

    const saveTag = e => {
        setSubmitted(true);

        let data = {
            tagName : tags.tagName,
            tagDescription : tags.tagDescription
        };
        e.preventDefault();
        
        if(tags._id){
            dispatch(updateTag(tags._id, data))
            .then(response => {
                setTags({
                    tagName : "",
                    tagDescription : ""
                });
            })
            .catch(e => {
            console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Updated', detail:'Tag updated successfully', life: 3000});
            setRefreshKey(oldKey => oldKey +1)
        }
        else{
            dispatch(createTag({...data, name: google?.result?.name}))
            .then(response => {
                setTags({
                    tagName : "",
                    tagDescription : ""
                });
            })
            .catch(e => {
                console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Success', detail:'Tag created successfully', life: 3000});
        }
    }

    const editTag = (id) => {
        leadservice.retriveTag(id)
        .then(response => {
            setTags(response.data);
          })
          .catch(e => {
            console.log(e);
          });
    }

    const deletedTag = (id) => {
        dispatch(deleteTag(id))
            .catch(e => {
                // console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Success', detail:'Tag deleted successfully', life: 3000});
        };

    useEffect(() => {
        dispatch(fetchTag());
}, [refreshKey, dispatch]);


    return (
        <div className="datatable-crud-demo" >
            <Toast ref={toast} />
            <div className="head-tag">
            <h4>Tags</h4>
            </div>   
            <div className="card cardadj">

            <div  className="col-sm-4 tag-segment">
                <div className="p-field">
                    <label htmlFor="tagName">Tag name</label>
                    <div className="p-col">
                    <InputText 
                        id="tagName" 
                        name="tagName" 
                        type="text" 
                        //className="p-inputtext-sm p-d-block p-mb-2 textadj"
                        value={tags.tagName}
                        onChange={handleInputChange}
                        required 
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !tags.tagName }), "p-inputtext-sm p-d-block p-mb-2 textadj"}
                        />
                        {submitted && !tags.tagName && <small className="p-error">Tag name is required.</small>}
                    </div>
                    </div><br/>
                <div className="p-field">
                    <label htmlFor="tagDescription">Tag description <small>(optional)</small></label>
                    <div className="p-col">
                    <InputTextarea 
                        rows={5} 
                        cols={45} 
                        id="tagDescription"        
                        name="tagDescription"
                        className="textadj"
                        value={tags.tagDescription}
                        onChange={handleInputChange}
                        />
                    </div>
                </div>

                {google?(<>
                <Button 
                label={tags._id ? "Update Tag" : "Create tag"}
                className="p-button-info p-button-sm create-tag"
                onClick={saveTag}
                /> 
                </>):(<><div>
                    <Link to={"/auth"}>Signin</Link> to create tags
                    </div></>)}      
            </div>

        <font size="2" className="col-sm-8">
            <div className="table-responsive tableadj">
                <div className="tag-new newtag">

                    <form onSubmit={handleSubmit}>
                        <InputText 
                        id="ftag" 
                        name="ftag" 
                        value={filter.ftag} 
                        type="text" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        onChange={handleFilter} 
                        placeholder="Search tags..."
                        style={{marginRight: '.3em'}}  
                        />
                        <Button 
                            icon="pi pi-search"
                            className="p-button-info p-button-sm p-button-outlined"
                            type="submit" 
                            style={{marginRight: '.3em'}}
                        />
                        <Button 
                            icon="pi pi-times"
                            className="p-button-info p-button-sm p-button-outlined"
                            type="submit" 
                            onClick={filterReset}
                        />
                    </form>
                </div>
                {!getTags.length ? <i className="pi pi-spin pi-spinner loader"></i> :
                <table id="myTable" className="table table-striped table-bordered table-hover table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>#Leads</th>
                        <th>Created</th>
                        {google?(<>
                        <th>Action</th>
                        </>):
                        (<>
                        </>)}
                    </tr>
                </thead>
                
                <tbody>
                {currentPosts.map((data, index) => (
                <tr key={index} style={{height:"42px"}}>
                    <td>
                        {data.tagName}
                    </td>
                    <td>
                    {posts.filter((p,i) => p.tags[0] === data.tagName).map(k => k).length}
                    </td>
                    <td>
                        {new Date(data.createdAt).toLocaleDateString()}
                    </td>               
                    
                    {google?(<>
                        <td>
                            <div className="dropdown">
                            <Button 
                            className="p-button-outlined p-button-secondary p-button-sm"
                            icon="pi pi-ellipsis-h" 
                            type="button" 
                            id="dropdownMenuButton" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                            />
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <Link 
                                to={"/viewtagsleads/" + data.tagName} 
                                style={{textDecoration:"none"}}>
                                <Button 
                                label="View leads" 
                                icon="pi pi-users" 
                                className="p-button-text p-button-secondary p-button-sm" 
                                /></Link>
                                <br />
                                {/* <Button label="Import Leads" icon="pi pi-arrow-circle-up" className="p-button-text p-button-secondary p-button-sm"  /><br/> */}
                                <Button 
                                label="Edit Tag" 
                                icon="pi pi-pencil" 
                                className="p-button-text p-button-secondary p-button-sm" 
                                onClick={() => editTag(data._id)}
                                />
                                <br/>
                                <Button 
                                label="Delete Tag" 
                                icon="pi pi-trash" 
                                className="p-button-text p-button-danger p-button-sm" 
                                onClick={() => deletedTag(data._id)}
                                />
                            </div>
                            </div>
                        </td>
                    </>):
                    (<>
                    </>)}
                    
                               
                </tr>
                ))} 
                </tbody>
                </table>}
                </div>
                    <Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={getTags.length} paginate={paginate}/>
                </font>
                

            </div>
           
        </div>
    );
}

export default Tags;