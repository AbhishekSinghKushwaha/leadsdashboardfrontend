import React, { useState, useEffect, useRef, useMemo  } from "react";


import { Link } from "react-router-dom";
import Pagination from '../pagination';
import leadservice from '../../services/leadservice';
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
import {fetchAll, createPost, updateUser, filterData, deleteUser} from '../../actions/posts';
import { Card } from 'primereact/card';
import useSortableData from '../sorting';


const Piloet = () => {

    const emptyUser = {
        _id : "",
        companyname : "",
        url : "",
        technology : "",
        location : "",
        source : "",
        type : "",
        noofpositions : "",
        experience : "",
        sourceurl : "",
        lastreply : "",
        status : "",
        whentoconnect:"",
        comments : "",
        lastfollowup : "",
        estimates : "",
        projectDuration : "",
        timeZone : "",
    };

    const emptyFilter = {
        author:"",
        cname:"",
        curl:"",
        tech:"",
        stype:""
    }
    
    const [submitted, setSubmitted] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [setMessage] = useState("");
    const [user, setUser] = useState(emptyUser);
    console.log(user, "USERDISPLAY");
    const [userDetails, setUserDetails] = useState([{ 
        contactname : "",
        emailaddress : "",
        phone : "",
        designation : "",
    }]);
    console.log(userDetails, "USERDetails");
    const [filter, setfilter] = useState(emptyFilter);
    const dispatch = useDispatch();
    const posts = useSelector((state)=>state.posts ? state.posts.filter((p)=>p.status === "Piloet"): null);
    console.log(posts,"Connect Back")
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));
    const [refreshKey, setRefreshKey] = useState(0);
    const option = useMemo(() => countryList().getData(), []);
    const toast = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const { items, requestSort, sortConfig } = useSortableData(currentPosts);
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
        return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    }    

    useEffect(() => {
            dispatch(fetchAll());
    }, [dispatch, refreshKey]);

    const editUser = (id) => {
        setSubmitted(false);
        setUserDialog(true);

        leadservice.get(id)
          .then(response => {
            setUser(response.data);
            setUserDetails(response.data.userdetails);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
        }

        const hideDialog = () => {
            setSubmitted(false);
            setUserDialog(false);
        }

      const deletedUser = (id) => {
        dispatch(deleteUser(id))
          .catch(e => {
            console.log(e);
          })
          toast.current.show({severity:'success', summary: 'Success', detail:'Lead Deleted Successfully', life: 3000});
      };

      const handleInputChange = event => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
      };

      function handleChange(i, event) {
        const { name, value } = event.target;
        const values = [...userDetails];
        values[i][name] = value;
        setUserDetails(values);
      }

    const saveData = e => {

      setSubmitted(true);
      
      let data = {
          companyname : user.companyname,
          url : user.url,
          technology : user.technology,
          location : user.location,
          source : user.source,
          type : user.type,
          noofpositions : user.noofpositions,
          experience : user.experience,
          sourceurl : user.sourceurl,
          userdetails: userDetails,
          lastreply : user.lastreply,
          status : user.status,
          whentoconnect : user.whentoconnect,
          comments : user.comments,
          lastfollowup : user.lastfollowup,
          estimates : user.estimates,
          projectDuration : user.projectDuration,
          timeZone : user.timeZone
      };
      e.preventDefault();

      if(user._id){
        dispatch(updateUser(user._id, data))
        .then(response => {
          console.log(response.data);
          setMessage("The data updated successfully!");
        })
        .catch(e => {
          console.log(e);
        })
        toast.current.show({severity:'success', summary: 'Updated', detail:'Updated Successfully', life: 3000});
        setRefreshKey(oldKey => oldKey +1)
        setUserDialog(false);
      }
      else{
      dispatch(createPost({...data, name: google?.result?.name}))
      .then(response => {
          setUser({
          _id: response.data.id,
          companyname : response.data.companyname,
          url : response.data.url,
          technology : response.data.technology,
          location : response.data.location,
          source : response.data.source,
          type : response.data.type,
          noofpositions : response.data.noofpositions,
          experience : response.data.experience,
          sourceurl : response.data.sourceurl,
          userdetails: response.data.userdetails,           
          lastreply : response.data.lastreply,
          status : response.data.status,
          whentoconnect : response.data.whentoconnect,
          comments : response.data.comments,
          lastfollowup : response.data.lastfollowup,
          estimates : response.data.estimates,
          projectDuration : response.data.projectDuration,
          timeZone : response.data.timeZone
          });
      })
      .catch(e => {
          console.log(e);
      })
      setUserDialog(false);
      toast.current.show({severity:'success', summary: 'Success', detail:'Lead details recorded successfully', life: 3000});
    }
  };

      const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(filterData(filter));
      }

      const handleFilter = event => {
        const { name, value } = event.target;
        setfilter({ ...filter, [name]: value });
      };

      const filterReset = () => {
          setfilter({
            author:"",
            cname:"",
            curl:"",
            tech:"",
            stype:""
          })
      }

      const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label={user._id ? "Update": "Save"} icon="pi pi-check" className="p-button-text" onClick={saveData}/>
        </React.Fragment>
    );

      const tech = ["NodeJS", ".NET", "ReactJS", "AngularJS", "Php", "Python", "Java", "VueJS", "ExpressJS"];

      const statusoptions = ["In-Process", "Piloet", "Project", "Stopped", "Connect Back"];
         
      const months = ["1 Month","2 Months","3 Months","4 Months","5 Months","6 Months","7 Months","8 Months","9 Months","10 Months","11 Months","12 Months"];
    
      const type = ["Outsourcing", "Contract to hire"];

      const footer = (
        <span className="pfooter">
            <div className="row">
                <div className="column">
                    <h6 className="totalleads">Total Leads: {posts.length}</h6>
                </div>
                <div className="column">
                    <Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
                </div>
            </div>
        </span>
    );

    return ( 
        <div className="piloet">
             <Toast ref={toast} />
            <Card className="cardname" footer={footer}>
            <div className="view-title">
                <div>
                <form onSubmit={handleSubmit}>
                    <InputText 
                        id="author" 
                        name="author" 
                        value={filter.author} 
                        type="text" 
                        onChange={handleFilter} 
                        placeholder="Author" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        style={{marginRight: '.5em'}}
                    />
                    <InputText 
                        id="cname" 
                        name="cname" 
                        value={filter.cname} 
                        type="text" 
                        onChange={handleFilter} 
                        placeholder="Company Name" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        style={{marginRight: '.5em'}}
                    />
                    <InputText 
                        id="curl" 
                        name="curl" 
                        value={filter.curl} 
                        type="text" 
                        onChange={handleFilter} 
                        placeholder="URL" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        style={{marginRight: '.5em'}}
                    />
                    <InputText 
                        id="tech" 
                        name="tech" 
                        value={filter.tech} 
                        type="text" 
                        onChange={handleFilter} 
                        placeholder="Technology" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        style={{marginRight: '.5em'}}
                    />
                    <Dropdown 
                        id="stype" 
                        name="stype" 
                        value={filter.stype} 
                        options={type} 
                        onChange={handleFilter} 
                        placeholder="Select Type" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        style={{marginRight: '.5em'}}
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

                {google?(<>
                <div>
                <Button label="Add Lead" icon="pi pi-plus" className="p-button-sm p-button-info p-button-outlined" onClick={openNew}/>
                </div>
                </>):(<><div>
                    <Link to={"/auth"}>Signin</Link> to add leads
                    </div></>)}
            </div>
            <br />
              
            <font size="2">
                <div className="table-responsive">
                <table id="myTable" className="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('name')} className={getClassNamesFor('name')}>Author</th>
                        <th onClick={() => requestSort('createdAt')} className={getClassNamesFor('createdAt')}>Date</th>
                        <th onClick={() => requestSort('companyname')} className={getClassNamesFor('companyname')}>Company Name</th>
                        <th onClick={() => requestSort('url')} className={getClassNamesFor('url')}>URL</th>
                        <th onClick={() => requestSort('technology')} className={getClassNamesFor('technology')}>Technology</th>
                        <th onClick={() => requestSort('source')} className={getClassNamesFor('source')}>Source</th>
                        <th onClick={() => requestSort('type')} className={getClassNamesFor('type')}>Type</th>
                        <th onClick={() => requestSort('noofpositions')} className={getClassNamesFor('noofpositions')}>No of Positions</th>
                        <th onClick={() => requestSort('experience')} className={getClassNamesFor('experience')}>Experience</th>
                        <th onClick={() => requestSort('status')} className={getClassNamesFor('status')}>Status</th>
                        <th>Contact No</th>
                        <th onClick={() => requestSort('lastfollowup')} className={getClassNamesFor('lastfollowup')}>Last Followup</th>
                        {google?(<>
                        <th>Action</th>
                        </>):
                        (<>
                        </>)}
                    </tr>
                </thead>
                <tbody>
                {items.map((data, index) => (
                <tr key={index} style={{height:"42px"}}>
                    <td>
                        {data.name}
                    </td>
                    <td>
                        {new Date(data.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                        {data.companyname}
                    </td>    
                    <td>
                        {data.url}
                    </td> 
                    <td>
                        {data.technology +','}
                    </td> 
                    <td>
                        {data.source}
                    </td> 
                    <td>
                        {data.type}
                    </td> 
                    <td>
                        {data.noofpositions}
                    </td> 
                    <td>
                        {data.experience}
                    </td> 
                    <td>
                        {data.status}
                    </td> 
                    <td>
                        {data.userdetails[0].phone}
                    </td> 
                    <td>
                        {new Date(data.lastfollowup).toLocaleDateString()}
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
                                <Link to={"/view/" + data._id} style={{textDecoration:"none"}}><Button label="View Lead" icon="pi pi-info-circle" className="p-button-text p-button-secondary p-button-sm"/></Link><br/>
                                <Button label="Edit Lead" icon="pi pi-pencil" className="p-button-text p-button-secondary p-button-sm" onClick={() => editUser(data._id)}/><br/>
                                <Button label="Delete Lead" icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" onClick={() => deletedUser(data._id)}/>
                            </div>
                            </div>
                        </td>
                    </>):
                    (<>
                    </>)}
                    
                               
                </tr>
                ))} 
                </tbody>
                </table>
                </div>
                </font>
                <h6><em>Showing {currentPosts.length} of {posts.length} leads details</em></h6>
            </Card>

            <Dialog visible={userDialog} style={{ width: '600px' }} header="Update Leads Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
            <div className="p-field">
                        <label htmlFor="companyname">Company Name</label>
                        <div className="p-col">
                            <InputText 
                            id="companyname" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.companyname })}
                            value={user.companyname}
                            onChange={handleInputChange}
                            name="companyname"
                            required 
                            autoFocus
                            />
                            {submitted && !user.companyname && <small className="p-error">Company name is required.</small>}
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
                            required                             
                            />
                            {submitted && !user.url && <small className="p-error">URL is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>Technology</label>
                    <MultiSelect 
                    value={user.technology} 
                    options={tech} 
                    onChange={handleInputChange} 
                    placeholder="Select Technologies" 
                    display="chip" 
                    name="technology"
                    required                     
                    className={classNames({ 'p-invalid': submitted && !user.technology})} 
                    />
                    {submitted && !user.technology && <small className="p-error">Technology is required.</small>}
                    </div><br/>
                    
                    <div className="p-field">
                    <label>Location</label>
                    <Dropdown 
                    value={user.location} 
                    options={option} 
                    optionLabel="label" 
                    onChange={handleInputChange} 
                    filter 
                    filterBy="label" 
                    name="location"
                    required                     
                    className={classNames({ 'p-invalid': submitted && !user.location})} 
                    />
                    {submitted && !user.location && <small className="p-error">Location is required.</small>}
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
                            required                              
                            />
                            {submitted && !user.source && <small className="p-error">Source is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>Type</label>
                        <div className="p-formgrid p-grid">
                
                    <div className="p-field-radiobutton">
                        <RadioButton 
                        //className="radio-type" 
                        inputId="radio1" 
                        value="Outsourcing" 
                        onChange={handleInputChange } 
                        checked={user.type === 'Outsourcing'}  
                        name="type"
                        required                         
                        className={classNames({ 'p-invalid': submitted && !user.type }), "radio-type"}
                        />
                        <label htmlFor="radio1" className="radio-padding">Outsouring</label><br />
                    </div>
                    <div className="p-field-radiobutton">
                        <RadioButton 
                        className="radio-type" 
                        inputId="radio2" 
                        value="Contract to hire" 
                        onChange={handleInputChange} 
                        checked={user.type === 'Contract to hire'}  
                        name="type"
                        required                         
                        className={classNames({ 'p-invalid': submitted && !user.type }), "radio-type"}
                        />
                        <label htmlFor="radio2" className="radio-padding">Contract to hire</label><br />
                        {submitted && !user.type && <small className="p-error">Type is required.</small>}
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
                                required                                 
                                />
                                {submitted && !user.noofpositions && <small className="p-error">No of positions is required.</small>}
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
                                required                                  
                                />
                                {submitted && !user.experience && <small className="p-error">Experience is required.</small>}
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
                            required                             
                            />
                            {submitted && !user.sourceurl && <small className="p-error">Source url is required.</small>}
                        </div>
                    </div><br/>

                    {userDetails.map((data, index) => {
                    return (
                    <div key={`${data}-${index}`}>

                    <div className="p-field">
                        <label htmlFor="contactname">Contact Name</label>
                        <div className="p-col">
                            <InputText
                            id="contactname" 
                            className={classNames({ 'p-invalid': submitted && !data.contactname})}
                            value={data.contactname}
                            onChange={e => handleChange(index, e)}
                            name="contactname"
                            required                            
                            />
                            {submitted && !data.contactname && <small className="p-error">Name is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <div className="p-col">
                            <InputText 
                            id="email" 
                            className={classNames({ 'p-invalid': submitted && !data.emailaddress})}
                            value={data.emailaddress}
                            type = "email"
                            onChange={e => handleChange(index, e)}
                            name="emailaddress"
                            required                              
                            />
                            {submitted && !data.emailaddress && <small className="p-error">Email is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="p-col">
                            <InputText 
                            id="phone" 
                            className={classNames({ 'p-invalid': submitted && !data.phone})}
                            value={data.phone}
                            onChange={e => handleChange(index, e)}
                            name="phone"
                            required                             
                            />
                            {submitted && !data.phone && <small className="p-error">Phone is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="designation">Designation</label>
                        <div className="p-col">
                            <InputText 
                            id="designation" 
                            className={classNames({ 'p-invalid': submitted && !data.designation})}
                            value={data.designation}
                            onChange={e => handleChange(index, e)}
                            name="designation"
                            required                             
                            />
                            {submitted && !data.designation && <small className="p-error">Designation is required.</small>}
                        </div>
                    </div><br/>
                    </div>
                    );
                })}

                    <div className="p-field">
                        <label htmlFor="lastreply">Last Reply</label>
                        <div className="p-col">
                            <InputTextarea 
                            rows={5} 
                            cols={30} 
                            id="lastreply" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.lastreply})}
                            value={user.lastreply}
                            onChange={handleInputChange}
                            name="lastreply"
                            required   
                            />
                            {submitted && !user.lastreply && <small className="p-error">Last reply is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>Status</label>
                    <Dropdown 
                    value={user.status} 
                    options={statusoptions} 
                    onChange={handleInputChange} 
                    placeholder="Select a status" 
                    name="status"
                    required 
                    className={classNames({ 'p-invalid': submitted && !user.status })}
                    />
                    {submitted && !user.status && <small className="p-error">Status is required.</small>}
                    </div><br/>
                    {user.status==="Connect Back" && <div><div className="p-field">
                        <label htmlFor="whentoconnect">When to Connect</label>
                        
                        <Dropdown 
                        value={user.whentoconnect} 
                        options={months} 
                        onChange={handleInputChange} 
                        name="whentoconnect"
                        required  
                        className={classNames({ 'p-invalid': submitted && !user.whentoconnect })}
                        />
                        {submitted && !user.whentoconnect && <small className="p-error">Status is required.</small>}

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
                            value={user.comments}
                            onChange={handleInputChange}
                            name="comments"
                            required 
                            />
                            {submitted && !user.comments && <small className="p-error">Feedback is required.</small>}
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
                            required 
                            />
                            {submitted && !user.estimates && <small className="p-error">Estimates is required.</small>}
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
                            required 
                            />
                            {submitted && !user.projectDuration && <small className="p-error">Project duration is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="timeZone">Time Zone</label>
                        <div className="p-col">
                            <InputText 
                            id="timeZone" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !user.timeZone})}
                            value={user.timeZone}
                            onChange={handleInputChange}
                            name="timeZone" 
                            required
                            />
                            {submitted && !user.timeZone && <small className="p-error">Timezone is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="icon">Last Followup On</label>
                        <Calendar 
                        id="icon" 
                        value={new Date(user.lastfollowup)} 
                        onChange={handleInputChange} 
                        showIcon 
                        name="lastfollowup"
                        required 
                        
                        className={classNames({ 'p-invalid': submitted && !user.lastfollowup})} 
                        />
                        {submitted && !user.lastfollowup && <small className="p-error">Last followup is required.</small>}
                    </div>
            </Dialog> 
        </div>
     );
}
 
export default Piloet;