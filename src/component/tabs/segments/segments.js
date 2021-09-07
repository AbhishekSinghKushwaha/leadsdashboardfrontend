import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import {fetchSegment, deleteSegment, filterSegment} from '../../../actions/segment';
import 'bootstrap/dist/js/bootstrap.bundle';

const Segments = () => {

    const emptyFilter = {
        fsegment:"",
    }

    const [filter, setfilter] = useState(emptyFilter);

    const dispatch = useDispatch();
    const getsegments = useSelector((state)=>state.segments);

    const toast = useRef(null);
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));

    const handleFilter = event => {
        const { name, value } = event.target;
        setfilter({ ...filter, [name]: value });
      };

    const filterReset = () => {
        setfilter({
            fsegment:"",
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(filterSegment(filter));
      }

    const deletedSegment = (id) => {
    dispatch(deleteSegment(id))
        .catch(e => {
            console.log(e);
        })
        toast.current.show({severity:'success', summary: 'Success', detail:'Segment Deleted Successfully', life: 3000});
    };

    useEffect(() => {
        dispatch(fetchSegment());     
    }, [dispatch]);

    return ( 
        <div className="segments">
            <Toast ref={toast} />
            
            <Card className="cardname"> 
            <div className="campaign-new newtask">
                {google?(<>
                <Link to="/segment" style={{textDecoration:"none"}}>
                    <Button 
                    label="Create New"
                    icon="pi pi-plus" 
                    className="p-button-sm p-button-info p-button-outlined"
                    />
                </Link>
                </>):(<><div>
                    <Link to={"/auth"}>Signin</Link> to create segments
                    </div></>)}

                <form onSubmit={handleSubmit}>                    
                    <InputText 
                        id="fsegment" 
                        name="fsegment" 
                        value={filter.fsegment} 
                        type="text" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        onChange={handleFilter} 
                        placeholder="Search segments..."
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
                        
            <font size="2">
                <div className="table-responsive">
                {!getsegments.length ? <i className="pi pi-spin pi-spinner loader"></i> :
                <table id="myTable" className="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>#Total</th>
                        <th>#Subscribed</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                
                <tbody>
                {getsegments.map((data, index) => (
                    <tr key={index} style={{height:"47px"}}>
                        <td>{data.segmentName}</td>
                        <td>0</td>
                        <td>0</td>
                        <td>{new Date(data.createdAt).toLocaleDateString()}</td>
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
                                to={"/viewsegment/" + data._id} 
                                style={{textDecoration:"none"}}>
                                <Button 
                                label="View leads" 
                                icon="pi pi-users" 
                                className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" 
                                /></Link>
                                
                                <Link 
                                to={"/segment/" + data._id} 
                                style={{textDecoration:"none"}}>
                                <Button 
                                label="Edit segment" 
                                icon="pi pi-pencil" 
                                className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" 
                                /></Link>
                                
                                <Button 
                                label="Delete segment" 
                                icon="pi pi-trash" 
                                className="p-button-text p-button-danger p-button-sm btn-block dropbutton" 
                                onClick={() => deletedSegment(data._id)}
                                />
                            </div>
                            </div>
                        </td>
                    </tr>
                    ))}                
                </tbody>
                </table>}
                </div>
                </font>
            </Card>
        </div>
     );
}
 
export default Segments;