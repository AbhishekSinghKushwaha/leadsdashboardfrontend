import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import {fetchCampaign, deleteCampaign, filterCampaign} from '../../../actions/campaign';
import 'bootstrap/dist/js/bootstrap.bundle';

const Campaign = () => {

    const emptyFilter = {
        //campaignview:"",
        fcampaign:"",
    }
 
    const [filter, setfilter] = useState(emptyFilter);

    const getcampaigns = useSelector((state)=>state.campaigns);

    const dispatch = useDispatch();
    const toast = useRef(null);
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));

    const handleFilter = event => {
        const { name, value } = event.target;
        setfilter({ ...filter, [name]: value });
      };

    const filterReset = () => {
        setfilter({
          //campaignview:"",
          fcampaign:"",
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(filterCampaign(filter));
      }

    const type = ["All", "Draft", "Scheduled", "Queuing", "Waiting", "Sending", "Sent", "Cancelled", "Failed"];

    const deletedCampaign = (id) => {
        dispatch(deleteCampaign(id))
          .catch(e => {
            console.log(e);
          })
          toast.current.show({severity:'success', summary: 'Success', detail:'Campaign Deleted Successfully', life: 3000});
      };

    useEffect(() => {
        dispatch(fetchCampaign());     
    }, [dispatch]);

    return ( 
        <div className="campaign">
            <Toast ref={toast} />
            
            <Card className="cardname">        
            <div className="campaign-new newtask">
                {/* <Button label="Create New" icon="pi pi-plus" className="p-button-sm p-button-info p-button-outlined" onClick={createnewcampaign}/> */}
                {google?(<>
                <Link to="/campaign" style={{textDecoration:"none"}}>
                    <Button 
                    label="Create New"
                    icon="pi pi-plus" 
                    className="p-button-sm p-button-info p-button-outlined"
                    />
                </Link>
                </>):(<><div>
                    <Link to={"/auth"}>Signin</Link> to create campaigns
                    </div></>)}

                <form onSubmit={handleSubmit}>
                    <Dropdown 
                        id="campaignview" 
                        name="campaignview" 
                        value={filter.campaignview} 
                        options={type} 
                        onChange={handleFilter} 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        placeholder="View" 
                        style={{marginRight: '.3em'}}
                    />
                    
                    <InputText 
                        id="fcampaign" 
                        name="fcampaign" 
                        value={filter.fcampaign} 
                        type="text" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        onChange={handleFilter} 
                        placeholder="Search campaigns..."
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
                {!getcampaigns.length ? <i className="pi pi-spin pi-spinner loader"></i> :  
                <table id="myTable" className="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Recipients</th>
                        <th>#Open</th>
                        <th>%Open</th>
                        <th>#Click</th>
                        <th>%Click</th>
                        <th>Created</th>
                        {google?(<>
                        <th>Action</th>
                        </>):(<><div></div></>)}
                    </tr>
                </thead>
                
                <tbody>
                {getcampaigns.map((data, index) => (
                    <tr key={index} style={{height:"47px"}}>
                        <td>{data.campaignTitle}</td>
                        <td></td>
                        <td>0</td>
                        <td>0.00%</td>
                        <td>0</td>
                        <td>0.00%</td>
                        <td>{new Date(data.createdAt).toLocaleDateString()}</td>
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
                                <Link to={"/viewcampaign/" + data._id} style={{textDecoration:"none"}}>
                                <Button 
                                label="View Campaign" 
                                icon="pi pi-info-circle" 
                                className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" 
                                /></Link>
                                
                                <Link to={"/campaign/" + data._id} style={{textDecoration:"none"}}>
                                <Button 
                                label="Edit Campaign" 
                                icon="pi pi-pencil" 
                                className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" 
                                /></Link>
                                
                                <Button 
                                label="Delete Campaign" 
                                icon="pi pi-trash" 
                                className="p-button-text p-button-danger p-button-sm btn-block dropbutton" 
                                onClick={() => deletedCampaign(data._id)}
                                />
                            </div>
                            </div>
                        </td>
                        </>):(<><div></div></>)}
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
 
export default Campaign;