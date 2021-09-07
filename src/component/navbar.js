import React, { useState, useEffect, useRef} from 'react';

import leadservice from '../services/leadservice';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
import decode from 'jwt-decode';
import classNames from 'classnames';
import {fetchAws, getAws, createAws, updateAws, deleteAws} from '../actions/aws';

const Navbar = () => {

    const emptyAws = {
        accessKey : "",
        secretAccessKey : "",
        sesRegion : ""
    }
    
    const [aws, setAws] = useState(emptyAws);

    const [submitted, setSubmitted] = useState(false);
    const [awsDialog, setAwsDialog] = useState(false);
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));
    const [refreshKey, setRefreshKey] = useState(0);

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const toast = useRef(null);

    const logout = () => {
        dispatch({type:'LOGOUT'});
        setGoogle(null);
        history.push('/');
        window.location.reload(); 
    }

    const openNew = () => {

        const gname = google?.result?.name

        // getAwsUser
        leadservice.getAwsUser(gname)
          .then(response => {
            if(response.data.awsData[0]){
                setAws(response.data.awsData[0]);
                if(aws._id) {
                    toast.current.show({severity:'success', summary: 'Connected', detail:'Connected to Aws', life: 3000})
                }
            }
            else{
                setAws(emptyAws);
            }
          })
          .catch(e => {
            console.log(e);
          });

        // setAws(emptyAws);
        setSubmitted(false);
        setAwsDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setAwsDialog(false);
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAws({ ...aws, [name]: value });
    };

    const saveData = e => {
        setSubmitted(true);

        let data = {
            accessKey : aws.accessKey,
            secretAccessKey : aws.secretAccessKey,
            sesRegion : aws.sesRegion,
        };
        e.preventDefault();

        if(aws._id){
            dispatch(updateAws(aws._id, data))
            .then(response => {
                // console.log(response.data);
            })
            .catch(e => {
            console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Updated', detail:'Aws credentials updated successfully', life: 3000});
            setRefreshKey(oldKey => oldKey +1);
            setAwsDialog(false);
        }
        else{
            dispatch(createAws({...data, name: google?.result?.name}))
            .then(response => {
                setAws({
                    accessKey : response.data.accessKey,
                    secretAccessKey : response.data.secretAccessKey,
                    sesRegion : response.data.sesRegion
                });
            })
            .catch(e => {
                console.log(e);
            })
            setAwsDialog(false);
            toast.current.show({severity:'success', summary: 'Success', detail:'Aws credentials saved successfully', life: 3000});
        }      
    };

    const deletedAws = () => {
        dispatch(deleteAws(aws._id))
        .then(response => {
            setAws({
                accessKey : "",
                secretAccessKey : "",
                sesRegion : ""
            });
        })
        .catch(e => {
            console.log(e);
        })
        toast.current.show({severity:'success', summary: 'Success', detail:'Aws credentials deleted successfully', life: 3000});
        setAwsDialog(false);
    };

    const userDialogFooter = (
        <React.Fragment>
            <div className="view-title">
            <div>
                {aws._id ? <Button label="Delete Aws Credentials" icon="pi pi-trash" className="p-button-text p-button-danger" onClick={deletedAws}/> : ""}
            </div>
            <div>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
                <Button label={aws._id ? "Update credentials" : "Save credentials"} icon="pi pi-check" className="p-button-text" onClick={saveData}/>
            </div>
            </div>
        </React.Fragment>
    );

    const createNew = () => {
        return (
            <React.Fragment>
                {google? (
                    <>
                    {google.result.imageUrl?(
                    <>
                    <Avatar image={google.result.imageUrl} className="p-mr-2" size="large" shape="circle"/>
                    </>
                    ):(
                    <>
                    <Avatar className="p-mr-2" size="large" shape="circle">{google.result.name.charAt(0)}</Avatar>
                    </>
                    )}
                    {/* <h6 style={{marginRight: '.1em'}}>{google.result.name}</h6> */}
                    {/* <Button label="Logout" icon="pi pi-sign-out" className="p-button-sm p-button-secondary" onClick={logout} style={{marginRight: '.5em'}}/> */}

                    <div className="dropdown" style={{marginRight:".5rem"}}>
                            <Button 
                            className="p-button-text p-button-secondary p-button-sm"
                            icon="pi pi-angle-down" 
                            type="button" 
                            label={<h6>{google.result.name}</h6>}
                            iconPos="right"
                            id="dropdownMenuButton" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false"
                            />
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <Button label="Logout" icon="pi pi-sign-out" className="p-button-text p-button-sm p-button-secondary btn-block dropbutton" onClick={logout} style={{marginRight: '.5em'}}/>
                        </div>
                    </div>
                    
                    <Button label="Connect AWS account" icon="pi pi-amazon" className="p-button-sm p-button-warning" onClick={openNew}/>      
                    </>
                ) : (
                    <>
                    <Link to={"/auth"} className="back-button" style={{textDecoration:"none"}}><Button label="Sign In" icon="pi pi-sign-in" className="p-button-sm p-button-info"></Button></Link>
                    </>
                )}
                </React.Fragment>
        )
    }

    const createLeft = () => {
        return (
            <React.Fragment>
                    <Link to={"/"} className="back-button">Leads Dashboard</Link>
            </React.Fragment>
        )
    }

    const sesRegions = [
        "US East (Ohio)",
        "US East (N. Virginia)",
        "US West (N. California)",
        "US West (Oregon)",
        "Africa (Cape Town)",
        "Asia Pacific (Mumbai)",
        "Asia Pacific (Seoul)",
        "Asia Pacific (Singapore)",
        "Asia Pacific (Sydney)",
        "Asia Pacific (Tokyo)",
        "Canada (Central)",
        "China (Ningxia)",
        "Europe (Frankfurt)",
        "Europe (Ireland)",
        "Europe (London)",
        "Europe (Milan)",
        "Europe (Paris)",
        "Europe (Stockholm)",
        "Middle East (Bahrain)",
        "South America (São Paulo)",
        "AWS GovCloud (US)",
    ]


    useEffect(() => {
        const token = google?.token;

        //JWT...
        if(token){
            const decodeToken = decode(token);

            if(decodeToken.exp * 1000 < new Date().getTime()) logout();
        }
        setGoogle(JSON.parse(localStorage.getItem('profile')));

    }, [location]);

    return ( 
        <div className="adddetails">
            <Toast ref={toast} />
            <div className="card">
                
                <Toolbar className="p-mb-4" style={{ height: '60px' }} left={createLeft} right={createNew}></Toolbar>

                <Dialog visible={awsDialog} style={{ width: '600px' }} header="AWS Credentials" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>

                <div className="p-field">
                    <label htmlFor="aws">Head to the amazon add user page using this url:</label>
                    <a
                    href="https://console.aws.amazon.com/iam/home?#/users$new?step=details"
                    target="_blank"
                    >
                        https://console.aws.amazon.com/iam/home?#/users$new?step=details
                    </a>
                </div><br/>

                <div className="p-field">
                        <label htmlFor="accessKey">Access key ID</label>
                        <div className="p-col">
                            <InputText 
                            id="accessKey"                            
                            value={aws.accessKey}
                            onChange={handleInputChange}
                            name="accessKey"
                            required 
                            autoFocus 
                            className={classNames({ 'p-invalid': submitted && !aws.accessKey })}
                            />
                            {submitted && !aws.accessKey && <small className="p-error">Access key is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="secretAccessKey">Secret access key</label>
                        <div className="p-col">
                            <InputText 
                            id="secretAccessKey" 
                            type="text"
                            value={aws.secretAccessKey}
                            onChange={handleInputChange}
                            name="secretAccessKey"
                            required 
                            className={classNames({ 'p-invalid': submitted && !aws.secretAccessKey })}
                            />
                            {submitted && !aws.secretAccessKey && <small className="p-error">Secret access key is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>SES Region</label>
                    <Dropdown 
                        value={aws.sesRegion} 
                        options={sesRegions}
                        onChange={handleInputChange} 
                        name="sesRegion"
                        required 
                        className={classNames({ 'p-invalid': submitted && !aws.sesRegion })}
                        />
                        {submitted && !aws.sesRegion && <small className="p-error">SES region is required.</small>}
                    </div>
                </Dialog>
            </div>
        </div>
     );
}
 
export default Navbar;