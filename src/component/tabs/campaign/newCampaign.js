import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';
import { Editor } from 'primereact/editor';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Link, useHistory } from "react-router-dom";
import TimezoneSelect from 'react-timezone-select';
import {createCampaign, deleteCampaign, updateCampaign} from '../../../actions/campaign';
import {fetchSegment} from '../../../actions/segment';
import { useDispatch, useSelector } from 'react-redux';
import leadservice from '../../../services/leadservice';
import classNames from 'classnames';

const NewCampaign = props =>{

    const emptyCampaign = {
        campaignTitle : "",
        audience : "",
        segment : "",
        subject : "",
        preheaderText : "",
        senderName : "",
        senderEmail : "",
        replyEmail : "",
        delivery : "",
        deliveryDate : "",
        hours : "",
        minutes : "",
        ampm : "",
    };

    const [campaign, setCampaign] = useState(emptyCampaign);
    console.log(campaign,"Campaign")

    const [submitted, setSubmitted] = useState(false);

    const [content, setContent] = useState('');
    console.log(content,"content")

    const getsegments = useSelector((state)=>state.segments? state.segments.map((data)=>data.segmentName):null);

    const [selectedTimezone, setSelectedTimezone] = useState({})
    console.log(selectedTimezone,"selectedTimezone")
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));

    const toast = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCampaign({ ...campaign, [name]: value });
      };

    const saveCampaign = e => {
        setSubmitted(true);
        
        let data = {
            campaignTitle : campaign.campaignTitle,
            audience : campaign.audience,
            segment : campaign.segment,
            subject : campaign.subject,
            preheaderText : campaign.preheaderText,
            senderName : campaign.senderName,
            senderEmail : campaign.senderEmail,
            replyEmail : campaign.replyEmail,
            content : content,
            delivery : campaign.delivery,
            deliveryDate : campaign.deliveryDate,
            hours : campaign.hours,
            minutes : campaign.minutes,
            ampm : campaign.ampm,
            timeZone: selectedTimezone.value
        };
        e.preventDefault();

        if(campaign._id){
            dispatch(updateCampaign(campaign._id,data))
            .then(response => {
            console.log(response.data);
            })
            .catch(e => {
            console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Updated', detail:'Campaign updated successfully', life: 3000});
        }
        else{
            dispatch(createCampaign({...data, name: google?.result?.name}))
            .then(response => {
                setCampaign({
                    campaignTitle : response.data.campaignTitle,
                    audience : response.data.audience,
                    segment : response.data.segment,
                    subject : response.data.subject,
                    preheaderText : response.data.preheaderText,
                    senderName : response.data.senderName,
                    senderEmail : response.data.senderEmail,
                    replyEmail : response.data.replyEmail,
                    content : response.data.content,
                    delivery : response.data.delivery,
                    deliveryDate : response.data.deliveryDate,
                    hours : response.data.hours,
                    minutes : response.data.minutes,
                    ampm : response.data.ampm,
                    timeZone: response.data.timezone,
                });
            })
            .catch(e => {
                console.log(e);
            })
            toast.current.show({severity:'success', summary: 'Success', detail:'Campaign created successfully', life: 3000});
        }
    }

    // const hours = ["1","2","3","4","5","6","7","8","9","10","11","12"]
    const hours = [1,2,3,4,5,6,7,8,9,10,11,12]
    //const minutes = [ "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60"]
    const minutes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
    const ampm = ["AM", "PM"]


    const getCampaign = id => {
        leadservice.retriveCampaign(id)
          .then(response => {
            setCampaign(response.data);
            setSelectedTimezone(response.data.timeZone);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      };

      console.log(campaign);

      useEffect(() => {
        dispatch(fetchSegment()); 
        getCampaign(props.match.params.id);
      }, [dispatch, props.match.params.id]);


      const deletedCampaign = () => {
        dispatch(deleteCampaign(campaign._id))
          .then(response => {
            console.log(response.data); 
          })
          .catch(e => {
            console.log(e);
          })
          toast.current.show({severity:'success', summary: 'Campaign', detail:'Deleted Successfully', life: 3000});
          history.push('/');
      };

    return (
        <div>
            <Toast ref={toast} />
            <div className="Background">
                <div className="CmpBackbtn">
                    <h4>Create new campaign</h4>  
                </div>
                <div className="adjustment" >
                    
                    {/* Campaign Title */}
                    <InputText 
                    id="campaignTitle" 
                    type="text"
                    value={campaign.campaignTitle}
                    onChange={handleInputChange}
                    placeholder="Campaign Title" 
                    name="campaignTitle" 
                    //className="textadj"
                    required 
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !campaign.campaignTitle }), "textadj"}
                    />
                    {submitted && !campaign.campaignTitle && <small className="p-error">Title is required.</small>}

                    {/* Audience */}
                    <Accordion multiple activeIndex={[0, 1, 2, 3, 4]}>
                        <AccordionTab header="Audience">
                            <div className="p-field-radiobutton">
                                <RadioButton 
                                //className="radio-type" 
                                inputId="audience" 
                                value="All Subscribers" 
                                onChange={handleInputChange} 
                                checked={campaign.audience === 'All Subscribers'}  
                                name="audience"
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.audience }), "radio-type"}
                                />
                                <label htmlFor="audience" className="radio-padding">All Subscribers</label>
                            </div>
                            <div className="p-field-radiobutton">
                                <RadioButton
                                //className="radio-type"  
                                inputId="audience2"
                                value="Subscribers of a segement"
                                onChange={handleInputChange}
                                checked={campaign.audience === 'Subscribers of a segement'}  
                                name="audience" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.audience }), "radio-type"}
                                />
                                <label htmlFor="audience2" className="radio-padding">Subscribers of a segment</label>
                                <br />
                                {submitted && !campaign.audience && <small className="p-error">Audience is required.</small>}
                            </div>

                            {campaign.audience === 'Subscribers of a segement' && <div className="segment-radio">
                                <Dropdown 
                                    id="segment" 
                                    name="segment" 
                                    value={campaign.segment} 
                                    options={getsegments} 
                                    onChange={handleInputChange} 
                                    placeholder="Select segment"
                                    //className="p-inputtext-sm p-d-block p-mb-2" 
                                    style={{marginRight: '.3em'}}
                                    required 
                                    className={classNames({ 'p-invalid': submitted && !campaign.segment }), "p-inputtext-sm p-d-block p-mb-2"}
                                    />
                                <Link to="/segment" style={{textDecoration:"none"}}>
                                <Button 
                                icon="pi pi-external-link" 
                                className="p-button-secondary p-button-sm" 
                                label="Create new segement"
                                iconPos="right" 
                                />
                                </Link>
                                <br />
                                {submitted && !campaign.segment && <small className="p-error">Segment is required.</small>} 
                            </div>
                            }
                        </AccordionTab>

                        {/* Info */}
                        <AccordionTab header="Info">
                            <div className="p-field">
                            <label htmlFor="subject">Subject</label>
                            <div className="p-col">
                                <InputText 
                                id="subject" 
                                type="text"
                                //className="textadj"
                                value={campaign.subject}
                                onChange={handleInputChange}
                                name="subject"
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.subject }), "textadj"}
                                />
                                {submitted && !campaign.subject && <small className="p-error">Subject is required.</small>}
                            </div>
                            </div><br/>
                            <div className="p-field">
                            <label htmlFor="preheaderText">Preheader Text (optional)</label>
                            <div className="p-col">
                                <InputText 
                                id="preheaderText" 
                                type="text"
                                className="textadj"
                                value={campaign.preheaderText}
                                onChange={handleInputChange}
                                name="preheaderText"
                                />
                            </div>
                            </div><br/>
                            <div className="p-field">
                            <label htmlFor="senderName">Sender name</label>
                            <div className="p-col">
                                <InputText 
                                id="senderName" 
                                type="text"
                                //className="textadj"
                                value={campaign.senderName}
                                onChange={handleInputChange}
                                name="senderName"
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.senderName }), "textadj"}
                                />
                                {submitted && !campaign.senderName && <small className="p-error">Sender name is required.</small>}
                            </div>
                            </div><br/>
                            <div className="p-field">
                            <label htmlFor="senderEmail">Sender email address</label>
                            <div className="p-col">
                                <InputText 
                                id="senderEmail" 
                                type="text"
                                //className="textadj"
                                value={campaign.senderEmail}
                                onChange={handleInputChange}
                                name="senderEmail"
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.senderEmail }), "textadj"}
                                />
                                {submitted && !campaign.senderEmail && <small className="p-error">Sender email is required.</small>}
                            </div>
                            </div><br/>
                            <div className="p-field">
                            <label htmlFor="replyEmail">Reply to email address</label>
                            <div className="p-col">
                                <InputText 
                                id="replyEmail" 
                                type="text"
                                //className="textadj"
                                value={campaign.replyEmail}
                                onChange={handleInputChange}
                                name="replyEmail"
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.senderEmail }), "textadj"}
                                />
                                {submitted && !campaign.senderEmail && <small className="p-error">Reply email is required.</small>}
                            </div>
                            </div><br/>
                        </AccordionTab>

                        {/* Content */}
                        <AccordionTab header="Content">
                            <Editor 
                            style={{ height: '320px' }} 
                            value={campaign.content? campaign.content : content} 
                            onTextChange={(e) => setContent(e.htmlValue)} 
                            name="content"
                            required 
                            className={classNames({ 'p-invalid': submitted && !content }), "textadj"}
                            />
                            {submitted && !content && <small className="p-error">Content is required.</small>}
                        </AccordionTab>

                        {/* Delivery */}
                        <AccordionTab header="Delivery">
                            <div className="p-field-radiobutton">
                                <RadioButton 
                                className="radio-type" 
                                inputId="delivery" 
                                value="Send now" 
                                onChange={handleInputChange } 
                                checked={campaign.delivery === 'Send now'}  
                                name="delivery"
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.delivery }), "radio-type"}
                                />
                                <label htmlFor="delivery" className="radio-padding">Send now</label>
                            </div>
                            <div className="p-field-radiobutton">
                                <RadioButton
                                className="radio-type"  
                                inputId="delivery2"
                                value="Schedule"
                                onChange={handleInputChange }
                                checked={campaign.delivery === 'Schedule'}  
                                name="delivery" 
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.delivery }), "radio-type"}
                                />
                                <label htmlFor="delivery2" className="radio-padding">Schedule</label><br />
                                {submitted && !campaign.delivery && <small className="p-error">Delivery is required.</small>}
                            </div>
                            {campaign.delivery==="Schedule" &&<div className="new-campaign segment-radio">
                            <div className="p-field">
                                <label htmlFor="icon">Delivery date</label><br />
                                <Calendar 
                                id="icon" 
                                value={new Date(campaign.deliveryDate)} 
                                onChange={handleInputChange} 
                                showIcon 
                                name="deliveryDate"
                                required 
                                className={classNames({ 'p-invalid': submitted && !campaign.deliveryDate})}
                            /><br/>
                            {submitted && !campaign.deliveryDate && <small className="p-error">Delivery date is required.</small>}
                            </div>
                            <div className="p-field delivery-padding">
                            <label htmlFor="deliverytime">Delivery time</label>
                            <div className="p-col">
                                <Dropdown 
                                    id="hours" 
                                    name="hours" 
                                    value={campaign.hours} 
                                    options={hours} 
                                    onChange={handleInputChange} 
                                    style={{marginRight: '.3em'}}
                                    required 
                                    className={classNames({ 'p-invalid': submitted && !campaign.hours})}
                                />
                                <span>:</span>
                                <Dropdown 
                                    id="minutes" 
                                    name="minutes" 
                                    value={campaign.minutes} 
                                    options={minutes} 
                                    onChange={handleInputChange} 
                                    style={{marginLeft: '.3em'}}
                                    required 
                                    className={classNames({ 'p-invalid': submitted && !campaign.minutes})}
                                />
                                <Dropdown 
                                    id="ampm" 
                                    name="ampm" 
                                    value={campaign.ampm} 
                                    options={ampm} 
                                    onChange={handleInputChange} 
                                    style={{marginLeft: '.3em'}}
                                    required 
                                    className={classNames({ 'p-invalid': submitted && !campaign.ampm})}
                                />
                            </div>
                            {submitted && !campaign.hours && !campaign.minutes && !campaign.ampm && <small className="p-error">Time is required.</small>}
                            </div><br/>
                            </div>
                            }
                            <br />
                            <div className="p-field">
                                <label htmlFor="timezone">Time Zone</label>
                                <TimezoneSelect
                                value={selectedTimezone}
                                onChange={setSelectedTimezone}
                                />
                            </div>
                        </AccordionTab>
                    </Accordion>

                    <div className="bottombtns">
                    {google?(<>
                        <Button icon="pi pi-save" className="p-button-info p-button-sm p-button-text" label="Save Changes" onClick={saveCampaign}/>
                        <Button icon="pi pi-trash" className="p-button-danger p-button-sm p-button-text" label="Delete" style={{marginRight: 'auto',marginLeft:'.3rem'}} onClick={deletedCampaign}/>
                        <Button icon="pi pi-send" className="p-button-secondary p-button-sm" label="Send Test Email" style={{marginRight: '.3rem'}}/>
                        <Button label="Continue" className="p-button-info p-button-sm" iconPos="right" icon="pi pi-chevron-right"/>
                    </>):(<><div>
                        <Link to={"/auth"}>Signin</Link> to create campaigns
                        </div></>)}
                    </div>     
                </div>
            </div>
        </div>
    );
}

export default NewCampaign;