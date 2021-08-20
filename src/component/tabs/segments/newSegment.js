import React, { useState, useEffect, useRef } from 'react';

import { Link } from "react-router-dom";
import leadservice from '../../../services/leadservice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { fetchCampaign } from '../../../actions/campaign';
import { createSegment, updateSegment, fetchSegment } from '../../../actions/segment';
import { MultiSelect } from 'primereact/multiselect';
import 'bootstrap/dist/js/bootstrap.bundle';
import classNames from 'classnames';

const NewSegment = (props) => {

    const emptySegment = {
        segmentName : "",
        subscribers : ""
    };

    const [segment, setSegment] = useState(emptySegment);
    const [submitted, setSubmitted] = useState(false);
    console.log(segment,"segment");
    
    const [fields, setFields] = useState([{ 
        activityType : "",
        campaignValue: "",
        campaignMatch : "",
        campaigns: "",
        ecommerceValue: "",
        ecommerceMatch: "",
        ecommerce: "",
        tagsMatch: "",
        tags: "",
        segmentsMatch: "",
        segments: "",
        dateValue: "",
        isAfter:"",
        isBefore:"",
        isWithinStart:"",
        isWithinEnd:"",
        isNotWithinStart:"",
        isNotWithinEnd:"" 
    }]);
    console.log(fields,"fields")
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));

    const getsegments = useSelector((state)=>state.segments? state.segments.map((data)=>data.segmentName):null);

    const toast = useRef(null);
    const dispatch = useDispatch();

    const handleInputChange = event => {
        const { name, value } = event.target;
        setSegment({ ...segment, [name]: value });
      };

      function handleChange(i, event) {
        const { name, value } = event.target;
        const values = [...fields];
        values[i][name] = value;
        setFields(values);
      }
    
      function handleAdd() {
        const values = [...fields];
        values.push({ 
            activityType : "",
            campaignValue: "",
            campaignMatch : "",
            campaigns: "",
            ecommerceValue: "",
            ecommerceMatch: "",
            ecommerce: "",
            tagsMatch: "",
            tags: "",
            segmentsMatch: "",
            segments: "",
            dateValue: "",
            isAfter:"",
            isBefore:"",
            isWithinStart:"",
            isWithinEnd:"",
            isNotWithinStart:"",
            isNotWithinEnd:"" 
        });
        setFields(values);
      }
    
      function handleRemove(i) {
        const values = [...fields];
        values.splice(i, 1);
        setFields(values);
      }

    const saveSegment = e => {
        setSubmitted(true);

        let data = {
            segmentName : segment.segmentName,
            subscribers : segment.subscribers,
            segmentDetails : fields
        };
        e.preventDefault();

        if(segment._id){
            dispatch(updateSegment(segment._id,data))
            .then(response => {
            console.log(response.data);
            })
            .catch(e => {
            console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Updated', detail:'Segment updated successfully', life: 3000});
        }
        else{
            dispatch(createSegment({...data, name: google?.result?.name}))
            .catch(e => {
                console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Success', detail:'Segment created successfully', life: 3000});
        }
    }

    const getSegment = id => {
        leadservice.retriveSegment(id)
          .then(response => {
            setSegment(response.data);
            setFields(response.data.segmentDetails);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      };

      console.log(segment);

    const footer = (
        <div className="pfooter">
            <Button 
                className="p-button-info p-button-sm p-button-outlined" 
                label="Add new condition" 
                onClick={() => handleAdd()}
            />  
        </div>
    );

    const getcampaigns = useSelector((state)=>state.campaigns? state.campaigns.map((data)=>data.campaignTitle):null);
    const getTags = useSelector((state)=>state.tags? state.tags.map((data)=>data.tagName):null);

    const subscribers = ["All", "Any"];
    const activitytype = ["Campaign activity", "Date added", "E commerce activity", "Tags", "Segments"];
    const campaignValue = ["Opened", "Did not open", "Clicked", "Did not click", "Was delivered", "Was failed to deliver", "Was not sent"];
    const campaignMatch = ["All of the selected campaigns", "Any of the selected campaigns"];
    const ecommerceValue = ["Purchased", "Not purchased"];
    const ecommerceMatch = ["All of the selected products", "Any of the selected products"];
    const tagsMatch = ["All of the selected tags", "Any of the selected tags", "None of the selected tags"];
    const segmentsMatch = ["All of the selected segments", "Any of the selected segments"];
    const dateValue = ["Is after", "Is before", "Is within", "Is not within"];

    useEffect(() => {
        dispatch(fetchCampaign());
        dispatch(fetchSegment()); 
        getSegment(props.match.params.id);     
    }, [dispatch, props.match.params.id]);
    
    return ( 
        <div className="new-segment">
            <Toast ref={toast} />
            <div className="create-segment">
                <h4>Create segment</h4>
            </div>
            <div className="body-segment">
                <div className="p-field">
                    <label htmlFor="segmentName">Segment name</label>
                    <div className="p-col">
                        <InputText 
                        id="segmentName" 
                        name="segmentName" 
                        value={segment.segmentName}  
                        onChange={handleInputChange}
                        // className="textadj" 
                        required 
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !segment.segmentName }), "textadj"}
                        />
                        {submitted && !segment.segmentName && <small className="p-error">Segment name is required.</small>}
                    </div>
                </div><br/>

                <div className="p-field">
                    <label htmlFor="subscribers">Subscribers match</label>
                    <span> </span>
                    <Dropdown 
                    id="subscribers" 
                    name="subscribers" 
                    value={segment.subscribers} 
                    options={subscribers} 
                    onChange={handleInputChange} 
                    required 
                    className={classNames({ 'p-invalid': submitted && !segment.subscribers })}
                    />
                    <label htmlFor="subscribers" className="radio-padding">of the following conditions:</label><br />
                    {submitted && !segment.subscribers && <small className="p-error">Subscribers is required.</small>}
                </div><br/>

                <label htmlFor="activityType">Select activity type</label>
                <Card className="cardname" footer={footer}>
                {fields.map((field, index) => {
                    return (
                    <div key={`${field}-${index}`}>
                        {/* /////Code///// */}

                        <div className="p-field minus-button">
                            <div className="minus-div">
                            <Button 
                            className="p-button-rounded p-button-outlined p-button-danger minus-segment" 
                            icon="pi pi-minus" 
                            onClick={() => handleRemove(index)}
                            />  
                            </div>
                            
                            <div className="activity-type">
                            <Dropdown 
                            id="activityType" 
                            name="activityType" 
                            value={field.activityType} 
                            options={activitytype} 
                            onChange={e => handleChange(index, e)}
                            placeholder="Activity type" 
                            required 
                            className={classNames({ 'p-invalid': submitted && !field.activityType })}
                            />
                            {submitted && !field.activityType && <small className="p-error">Activity type is required.</small>}
                            </div>
                        </div>
                        <br />

                        {field.activityType === 'Campaign activity' &&
                        <div>
                            <div className="p-field activity-dropdown">
                                <Dropdown 
                                id="campaignValue" 
                                name="campaignValue" 
                                value={field.campaignValue} 
                                options={campaignValue} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Value"
                                //className="campaign-value"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.campaignValue }), "campaign-value"}
                                />
                                {submitted && !field.campaignValue && <small className="p-error">Campaign value is required.</small>}

                                <Dropdown 
                                id="campaignMatch" 
                                name="campaignMatch" 
                                value={field.campaignMatch} 
                                options={campaignMatch} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Match"
                                //className="campaign-match" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.campaignMatch }), "campaign-match"}
                                />
                                {submitted && !field.campaignMatch && <small className="p-error">Campaign match is required.</small>}
                            </div>
                            <br />

                            <div className="p-field">
                                <MultiSelect
                                id="campaigns" 
                                name="campaigns"  
                                value={field.campaigns} 
                                options={getcampaigns} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Select campaigns"
                                //className="campaigns-val" 
                                display="chip" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.campaigns }), "campaigns-val"}
                                />
                                {submitted && !field.campaigns && <small className="p-error">Campaigns is required.</small>}
                            </div>
                        </div>
                        }

                        {field.activityType === 'E commerce activity' && 
                        <div>
                            <div className="p-field activity-dropdown">
                                <Dropdown 
                                id="ecommerceValue" 
                                name="ecommerceValue" 
                                value={field.ecommerceValue} 
                                options={ecommerceValue} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Value"
                                //className="campaign-value"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.ecommerceValue }), "campaign-value"}
                                />
                                {submitted && !field.ecommerceValue && <small className="p-error">Ecommerce value is required.</small>}

                                <Dropdown 
                                id="ecommerceMatch" 
                                name="ecommerceMatch" 
                                value={field.ecommerceMatch} 
                                options={ecommerceMatch} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Match"
                                //className="campaign-match" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.ecommerceMatch }), "campaign-match"}
                                />
                                {submitted && !field.ecommerceMatch && <small className="p-error">Ecommerce match is required.</small>}
                            </div>
                            <br />

                            <div className="p-field">
                                <MultiSelect
                                id="ecommerce" 
                                name="ecommerce" 
                                value={field.ecommerce} 
                                //options={activitytype} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Select products"
                                //className="campaigns-val" 
                                display="chip" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.ecommerce }), "campaigns-val"}
                                />
                                {submitted && !field.ecommerce && <small className="p-error">Ecommerce is required.</small>}
                            </div>
                        </div>
                        }

                        {field.activityType === 'Tags' && 
                        <div>
                            <div className="p-field activity-dropdown">
                                <Dropdown 
                                id="tagsMatch" 
                                name="tagsMatch" 
                                value={field.tagsMatch} 
                                options={tagsMatch} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Match"
                                //className="campaign-value" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.tagsMatch }), "campaign-value"}
                                />
                                {submitted && !field.tagsMatch && <small className="p-error">Tags match is required.</small>}

                                <MultiSelect
                                id="tags" 
                                name="tags" 
                                value={field.tags} 
                                options={getTags} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Select tags"
                                //className="campaign-match"
                                display="chip" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.tags }), "campaign-match"}
                                />
                                {submitted && !field.tags && <small className="p-error">Tags is required.</small>}
                            </div>
                        </div>
                        }

                        {field.activityType === 'Segments' && 
                        <div>
                            <div className="p-field activity-dropdown">
                                <Dropdown 
                                id="segmentsMatch" 
                                name="segmentsMatch" 
                                value={field.segmentsMatch} 
                                options={segmentsMatch} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Match"
                                //className="campaign-value" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.segmentsMatch }), "campaign-value"}
                                />
                                {submitted && !field.segmentsMatch && <small className="p-error">Segments match is required.</small>}

                                <MultiSelect
                                 id="segments" 
                                 name="segments" 
                                 value={field.segments} 
                                 options={getsegments} 
                                 onChange={e => handleChange(index, e)}
                                 placeholder="Select segments"
                                 //className="campaign-match" 
                                display="chip" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.segments }), "campaign-match"}
                                />
                                {submitted && !field.segments && <small className="p-error">Segments is required.</small>}
                            </div>
                        </div>
                        }

                        {field.activityType === 'Date added' && 
                        <div>
                            <div className="p-field activity-dropdown">
                            <Dropdown 
                                id="dateValue" 
                                name="dateValue" 
                                value={field.dateValue} 
                                options={dateValue} 
                                onChange={e => handleChange(index, e)}
                                placeholder="Value"
                                //className="campaign-value"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.dateValue }), "campaign-value"}
                                />
                                {submitted && !field.dateValue && <small className="p-error">Date value is required.</small>}

                                {field.dateValue === "Is after" &&
                                <div>
                                <Calendar 
                                id="icon" 
                                value={new Date(field.isAfter)} 
                                onChange={e => handleChange(index, e)}
                                showIcon 
                                name="isAfter"
                                //className="campaign-match"
                                placeholder="Select date"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.isAfter }), "campaign-match"}
                                /><br/>
                                {submitted && !field.isAfter && <small className="p-error">IsAfter date is required</small>}
                                </div> 
                                }

                                {field.dateValue === "Is before" &&
                                <div> 
                                <Calendar 
                                id="icon" 
                                value={new Date(field.isBefore)} 
                                onChange={e => handleChange(index, e)}
                                showIcon 
                                name="isBefore"
                                //className="campaign-match"
                                placeholder="Select date"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.isBefore }), "campaign-match"}
                                /><br/>
                                {submitted && !field.isBefore && <small className="p-error">IsBefore date is required</small>}
                                </div>
                                }

                                {field.dateValue === "Is within" && 
                                <div>
                                <Calendar 
                                id="icon" 
                                value={new Date(field.isWithinStart)} 
                                onChange={e => handleChange(index, e)}
                                showIcon 
                                name="isWithinStart"
                                //className="isWithin"
                                placeholder="Select start date"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.isWithinStart }), "isWithin"}
                                />
                                {submitted && !field.isWithinStart && <small className="p-error">Start date is required</small>}

                                <Calendar 
                                id="icon" 
                                value={new Date(field.isWithinEnd)} 
                                onChange={e => handleChange(index, e)} 
                                showIcon 
                                name="isWithinEnd"
                                //className="isNotWithin"
                                placeholder="Select end date"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.isWithinEnd }), "isNotWithin"}
                                />
                                {submitted && !field.isWithinEnd && <small className="p-error">End date is required</small>}
                                </div>
                                }

                                {field.dateValue === "Is not within" && 
                                <div>
                                <Calendar 
                                id="icon" 
                                value={new Date(field.isNotWithinStart)} 
                                onChange={e => handleChange(index, e)} 
                                showIcon 
                                name="isNotWithinStart"
                                //className="isWithin"
                                placeholder="Select start date"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.isNotWithinStart }), "isWithin"}
                                />
                                {submitted && !field.isNotWithinStart && <small className="p-error">Start date is required</small>}

                                <Calendar 
                                id="icon" 
                                value={new Date(field.isNotWithinEnd)} 
                                onChange={e => handleChange(index, e)} 
                                showIcon 
                                name="isNotWithinEnd"
                                className="isNotWithin"
                                placeholder="Select end date"
                                required 
                                className={classNames({ 'p-invalid': submitted && !field.isNotWithinEnd }), "isNotWithin"}
                                />
                                {submitted && !field.isNotWithinEnd && <small className="p-error">End date is required</small>}
                                </div>
                                }
                            </div>
                        </div>
                        }
                        <Divider />
                    </div>
                    );
                })}
                
                </Card><br/>

                <Button 
                className="p-button-info p-button-sm" 
                label={segment._id? "Update Segment" : "Create segment"} 
                onClick={saveSegment}
                />  
            </div>                   
        </div>
     );
}
 
export default NewSegment;