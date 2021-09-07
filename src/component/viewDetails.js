import React, { useState, useEffect, useRef, useMemo  } from "react";
import leadservice from '../services/leadservice';

import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import { MultiSelect } from 'primereact/multiselect';
import countryList from 'react-select-country-list';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import {updateUser, deleteUser} from '../actions/posts';
import { Card } from 'primereact/card';
import {countries} from 'country-data';


const ViewDetails = props => {
    const emptyUser = {
        _id : null,
        companyname : "",
        url : "",
        technology : "",
        location : "",
        source : "",
        type : "",
        noofpositions : "",
        experience : "",
        sourceurl : "",
        contactname : "",
        emailaddress : "",
        phone : "",
        designation : "",
        lastreply : "",
        status : "",
        whentoconnect:"",
        comments : "",
        lastfollowup : "",
        estimates : "",
        projectDuration : "",
        timeZone : "",
        tags : "",
        subscribed : ""
    };

    const [submitted, setSubmitted] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [setMessage] = useState("");
    const [user, setUser] = useState(emptyUser);
    const post = useSelector((state) => user._id ? state.posts.find((p)=>p._id === user._id): null);
    const dispatch = useDispatch();
    const history = useHistory();

    const option = useMemo(() => countryList().getData(), []);
    const toast = useRef(null);


    const getUser = id => {
        leadservice.get(id)
          .then(response => {
            setUser(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      };


      useEffect(() => {
        getUser(props.match.params.id);
      }, [props.match.params.id]);

      
      const editUser = () => {
        setSubmitted(false);
        setUserDialog(true);
        }

        const hideDialog = () => {
            setSubmitted(false);
            setUserDialog(false);
        }

      const updatedUser = (e) => {
        e.preventDefault();
        dispatch(updateUser(user._id,user))
        .then(response => {;
          setMessage("The tutorial was updated successfully!");
        })
        .catch(e => {
          console.log(e);
        })
        toast.current.show({severity:'success', summary: 'Updated', detail:'Updated Successfully', life: 3000});
        setUserDialog(false);
      }; 
      
      const deletedUser = () => {
        dispatch(deleteUser(user._id))
          .then(response => {
            // console.log(response.data);
            
          })
          .catch(e => {
            console.log(e);
          })
          history.push('/');
      };


        const userDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                <Button label="Update" icon="pi pi-check" className="p-button-text" onClick={updatedUser}/>
            </React.Fragment>
        );
        
        const handleInputChange = event => {
            const { name, value } = event.target;
            setUser({ ...user, [name]: value });
          };

          const footer = (
            <span className="view-footer">
                <Link to={"/"} className="back-button" style={{textDecoration:"none"}}><Button label="Back to Home" icon="pi pi-angle-left" className="p-button-raised p-button-sm p-button-secondary"></Button></Link>
            </span>
        );
        
        const title = (
            <React.Fragment>
                <span className="view-title">
            <h4 style={{marginBottom:"20px"}}>Lead Details</h4>
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
                <div className="dropdown-menu dropdown-width" aria-labelledby="dropdownMenuButton">
                    <Button 
                    label="Edit lead" 
                    icon="pi pi-pencil" 
                    className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" 
                    onClick={editUser} 
                    />
                    <Button label="Delete lead" icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm btn-block dropbutton" onClick={deletedUser}/>          
                </div>
            </div> 
            </span>
            </React.Fragment>
        )

    const getTags = useSelector((state)=>state.tags? state.tags.map((data)=>data.tagName):null);

    const tech = ["NodeJS", ".NET", "ReactJS", "AngularJS", "Php", "Python", "Java", "VueJS", "ExpressJS"];

    const statusoptions = ["In-Process", "Piloet", "Project", "Stopped", "Connect Back"];
       
    const months = ["1 Month","2 Months","3 Months","4 Months","5 Months","6 Months","7 Months","8 Months","9 Months","10 Months","11 Months","12 Months"];

    return ( 
        <div className="view-details">
            <Toast ref={toast} />
            <Card className="cardname" title={title} footer={footer} style={{ width: '40rem'}}>
                <ul>
                    <li><label className="userlabels">Company Name:</label><span className="uservalues">{user.companyname}</span></li>
                    <li><label className="userlabels">URL:</label><span className="uservalues">{user.url}</span></li>
                    <li><label className="userlabels">technology:</label><span className="uservalues">{user.technology+','}</span></li>
                    <li><label className="userlabels">Location:</label><span className="uservalues">{countries[user.location].name}</span></li>
                    <li><label className="userlabels">Source:</label><span className="uservalues">{user.source}</span></li>
                    <li><label className="userlabels">Type:</label><span className="uservalues">{user.type}</span></li>
                    <li><label className="userlabels">No of Positions:</label><span className="uservalues">{user.noofpositions}</span></li>
                    <li><label className="userlabels">Experience:</label><span className="uservalues">{user.experience}</span></li>
                    <li><label className="userlabels">Source URL:</label><span className="uservalues">{user.sourceurl}</span></li>
                    <li><label className="userlabels">Contact Name:</label><span className="uservalues">{user.userdetails?user.userdetails[0].contactname:''}</span></li>
                    <li><label className="userlabels">Email:</label><span className="uservalues">{user.userdetails?user.userdetails[0].emailaddress:''}</span></li>
                    <li><label className="userlabels">Phone:</label><span className="uservalues">{user.userdetails?user.userdetails[0].phone:''}</span></li>
                    <li><label className="userlabels">Designation:</label><span className="uservalues">{user.userdetails?user.userdetails[0].designation:''}</span></li>
                    <li><label className="userlabels">Last Reply:</label><span className="uservalues">{user.lastreply}</span></li>
                    <li><label className="userlabels">Status:</label><span className="uservalues">{user.status}</span></li>
                    <li><label className="userlabels">When to Connect:</label><span className="uservalues">{user.whentoconnect}</span></li>
                    <li><label className="userlabels">Feedback:</label><span className="uservalues">{user.comments}</span></li>
                    <li><label className="userlabels">Estimates:</label><span className="uservalues">{user.estimates}</span></li>
                    <li><label className="userlabels">Project Duration:</label><span className="uservalues">{user.projectDuration}</span></li>
                    <li><label className="userlabels">Time Zone:</label><span className="uservalues">{user.timeZone}</span></li>
                    <li><label className="userlabels">Last Followup on:</label><span className="uservalues">{new Date(user.lastfollowup).toLocaleDateString()}</span></li>                    
                    <li><label className="userlabels">Tags:</label><span className="uservalues">{user.tags}</span></li>                    
                    <li><label className="userlabels">Subscribed:</label>
                    {/* <span className="uservalues">{user.subscribed}</span>
                    <span class={user.subscribed === "Yes" ? "badge badge-success text-uppercase" : "badge badge-danger text-uppercase"}>
                        {user.subscribed}
                    </span> */}
                    {user.subscribed === "Yes" ? 
                    <span className="uservalues">
                        <span class="badge badge-success text-uppercase">
                        Subscribed
                        </span> 
                    </span>: 
                    <span className="uservalues">
                        <span class="badge badge-danger text-uppercase">
                        Not subscribed
                        </span>
                    </span>
                    }
                    </li>                    
                </ul>
            </Card>
           
             <Dialog visible={userDialog} style={{ width: '600px' }} header="Update Leads Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
            <div className="p-field">
                        <label htmlFor="companyname">Company Name</label>
                        <div className="p-col">
                            <InputText 
                            id="companyname" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.comapanyname })}
                            required
                            key={user._id}
                            value={user.companyname}
                            onChange={handleInputChange}
                            name="companyname"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="url">URL</label>
                        <div className="p-col">
                            <InputText 
                            id="url" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.url})}
                            required
                            value={user.url}
                            onChange={handleInputChange}
                            name="url"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>Technology</label>
                    <MultiSelect value={user.technology} options={tech} onChange={handleInputChange} placeholder="Select Technologies" display="chip" name="technology"/>
                    </div><br/>
                    
                    <div className="p-field">
                    <label>Location</label>
                    <Dropdown value={user.location} options={option} optionLabel="label" onChange={handleInputChange} filter filterBy="label" name="location"/>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="source">Source</label>
                        <div className="p-col">
                            <InputText 
                            id="source" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.source })}
                            required
                            value={user.source}
                            onChange={handleInputChange}
                            name="source"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>Type</label>
                        <div className="p-formgrid p-grid">
                
                    <div className="p-field-radiobutton">
                        <RadioButton className="radio-type" inputId="radio1" value="Outsourcing" onChange={handleInputChange } checked={user.type === 'Outsourcing'}  name="type"/>
                        <label htmlFor="radio1" className="radio-padding">Outsouring</label>
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton className="radio-type" inputId="radio2" value="Contract to hire" onChange={handleInputChange} checked={user.type === 'Contract to hire'}  name="type"/>
                        <label htmlFor="radio2" className="radio-padding">Contract to hire</label>
                    </div><br/>
                            {user.type==="Contract to hire" && <div>
                <div className="p-field">
                    <label htmlFor="position">No of Positions</label>
                        <div className="p-col">
                            <InputText 
                                id="position" 
                                type="text"
                                className={classNames({ 'p-invalid': submitted && !user.noofpositions })}
                                required
                                value={user.noofpositions}
                                onChange={handleInputChange}
                                name="noofpositions"
                                />
                            </div>
                        </div><br/>

                <div className="p-field">
                    <label htmlFor="exp">Experience</label>
                        <div className="p-col">
                            <InputText 
                                id="exp" 
                                type="text"
                                className={classNames({ 'p-invalid': submitted && !user.experience})}
                                required
                                value={user.experience}
                                onChange={handleInputChange}
                                name="experience"
                            />
                        </div>
                </div><br/>
            </div>  }
                        </div>
                    </div>

                    <div className="p-field">
                        <label htmlFor="sourceurl">Source URL</label>
                        <div className="p-col">
                            <InputText 
                            id="sourceurl" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.sourceurl})}
                            required
                            value={user.sourceurl}
                            onChange={handleInputChange}
                            name="sourceurl"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="url">Contact Name</label>
                        <div className="p-col">
                            <InputText
                            id="cname" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.contactname})}
                            required
                            value={user.userdetails?user.userdetails[0].contactname:''}
                            onChange={handleInputChange}
                            name="contactname"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <div className="p-col">
                            <InputText 
                            id="email" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.emailaddress})}
                            required
                            value={user.userdetails?user.userdetails[0].emailaddress:''}
                            onChange={handleInputChange}
                            name="emailaddress"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="p-col">
                            <InputText 
                            id="phone" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.phone})}
                            required
                            value={user.userdetails?user.userdetails[0].phone:''}
                            onChange={handleInputChange}
                            name="phone"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="designation">Designation</label>
                        <div className="p-col">
                            <InputText 
                            id="designation" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.designation})}
                            required
                            value={user.userdetails?user.userdetails[0].designation:''}
                            onChange={handleInputChange}
                            name="designation"
                            />
                        </div>
                    </div><br/>
                    
                    <div className="p-field">
                        <label htmlFor="lastreply">Last Reply</label>
                        <div className="p-col">
                            <InputTextarea 
                            rows={5} 
                            cols={30} 
                            id="lastreply" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.lastreply})}
                            required
                            value={user.lastreply}
                            onChange={handleInputChange}
                            name="lastreply"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>Status</label>
                    <Dropdown value={user.status} options={statusoptions} onChange={handleInputChange} placeholder="Select a status" name="status"/>
                    </div><br/>
                    {user.status==="Connect Back" && <div><div className="p-field">
                        <label htmlFor="whentoconnect">When to Connect</label>
                        
                        <Dropdown value={user.whentoconnect} options={months} onChange={handleInputChange} name="whentoconnect"/>

                    </div><br/>
                    </div>
                    }
                    <div className="p-field">
                        <label htmlFor="comments">Feedback</label>
                        <div className="p-col">
                            <InputTextarea 
                            rows={5} 
                            cols={30} 
                            id="comments" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.comments})}
                            required
                            value={user.comments}
                            onChange={handleInputChange}
                            name="comments"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="estimates">Estimates</label>
                        <div className="p-col">
                            <InputText 
                            id="estimates" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.estimates})}
                            required
                            value={user.estimates}
                            onChange={handleInputChange}
                            name="estimates"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="projectDuration">Project Duration</label>
                        <div className="p-col">
                            <InputText 
                            id="projectDuration" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.projectDuration})}
                            required
                            value={user.projectDuration}
                            onChange={handleInputChange}
                            name="projectDuration"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="timeZone">Timings</label>
                        <div className="p-col">
                            <InputText 
                            id="timeZone" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.timeZone})}
                            required
                            value={user.timeZone}
                            onChange={handleInputChange}
                            name="timeZone"
                            />
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="icon">Last Followup On</label>
                        <Calendar id="icon" value={new Date(user.lastfollowup)} onChange={handleInputChange} showIcon name="lastfollowup"/>
                    </div><br/>

                    <div className="p-field">
                    <label htmlFor="tags">Tags <small>(optional)</small></label>
                        <MultiSelect
                        id="tags" 
                        name="tags" 
                        value={user.tags} 
                        options={getTags} 
                        onChange={handleInputChange}
                        placeholder="Select tags"
                        display="chip" 
                        // required 
                        // className={classNames({ 'p-invalid': submitted && !user.tags })}
                        />
                    </div><br />

                    <div className="p-field">
                    <label>Subscribed</label>
                    <div className="p-formgrid p-grid">

                        <div className="p-field-radiobutton">
                            <RadioButton 
                            //className="radio-type" 
                            inputId="radio3" 
                            value="Yes" 
                            onChange={handleInputChange } 
                            checked={user.subscribed === 'Yes'}  
                            name="subscribed"
                            required                         
                            className={classNames({ 'p-invalid': submitted && !user.subscribed }), "radio-type"}
                            />
                            <label htmlFor="radio3" className="radio-padding">Yes</label><br />
                        </div>
                        <div className="p-field-radiobutton">
                            <RadioButton 
                            className="radio-type" 
                            inputId="radio4" 
                            value="No" 
                            onChange={handleInputChange} 
                            checked={user.subscribed === 'No'}  
                            name="subscribed"
                            required                         
                            className={classNames({ 'p-invalid': submitted && !user.subscribed }), "radio-type"}
                            />
                            <label htmlFor="radio4" className="radio-padding">No</label><br />
                            {submitted && !user.subscribed && <small className="p-error">Subscribed is required.</small>}
                        </div>
                    </div>
                    </div>
            </Dialog>    
        </div>
     );
}
 
export default ViewDetails;