import React, { useState, useEffect, useRef, } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Link, useHistory } from "react-router-dom";
import { deleteCampaign } from '../../../actions/campaign';
import { useDispatch } from 'react-redux';
import leadservice from '../../../services/leadservice';
import { Card } from 'primereact/card';
import { Editor } from 'primereact/editor';

const ViewCampaign = (props) => {

    const emptyCampaign = {
        campaignTitle : "",
        audience : "",
        segment : "",
        subject : "",
        preheaderText : "",
        senderName : "",
        senderEmail : "",
        replyEmail : "",
        content : "",
        delivery : "",
        deliveryDate : "",
        hours : "",
        minutes : "",
        ampm : "",
        timeZone : ""
    };

    const [campaign, setCampaign] = useState(emptyCampaign);

    const toast = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const getCampaign = id => {
        leadservice.retriveCampaign(id)
          .then(response => {
            setCampaign(response.data);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      };

      console.log(campaign);

      useEffect(() => {
        getCampaign(props.match.params.id);
      }, [props.match.params.id]);

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

    const title = (
        <React.Fragment>
            <span className="view-title">
            <h4 style={{marginBottom:"20px"}}>Campaign Details</h4>
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
                    <Link to={"/campaign/" + campaign._id} style={{textDecoration:"none"}}>
                    <Button 
                    label="Edit campaign" 
                    icon="pi pi-pencil" 
                    className="p-button-text p-button-secondary p-button-sm"
                    /></Link> 
                    <br />           
                    <Button label="Delete campaign" icon="pi pi-trash" className="p-button-text p-button-danger p-button-sm" onClick={deletedCampaign}/>             
                </div>
            </div> 
            </span>         
        </React.Fragment>
    )

    const footer = (
        <span className="view-footer">
            <Link to={"/"} className="back-button" style={{textDecoration:"none"}}><Button label="Back to Home" icon="pi pi-angle-left" className="p-button-raised p-button-sm p-button-secondary"></Button></Link>
        </span>
    );


    return ( 
        <div className="view-campaign">
            <Toast ref={toast} />
            <Card className="cardname" title={title} footer={footer} style={{ width: '46rem'}}>
                <ul>
                    <li><label className="userlabels">Campaign title:</label><span className="uservalues">{campaign.campaignTitle}</span></li>
                    <li><label className="userlabels">Audience:</label><span className="uservalues">{campaign.audience}</span></li>
                    <li><label className="userlabels">Subject:</label><span className="uservalues">{campaign.subject}</span></li>
                    <li><label className="userlabels">Segment:</label><span className="uservalues">{campaign.segment}</span></li>
                    <li><label className="userlabels">Preheader text:</label><span className="uservalues">{campaign.preheaderText}</span></li>
                    <li><label className="userlabels">Sender name:</label><span className="uservalues">{campaign.senderName}</span></li>
                    <li><label className="userlabels">Sender email:</label><span className="uservalues">{campaign.senderEmail}</span></li>
                    <li><label className="userlabels">Reply email:</label><span className="uservalues">{campaign.replyEmail}</span></li>
                    <li><label className="userlabels">Delivery at:</label><span className="uservalues">{campaign.deliveryDate}</span></li>
                    <li><label className="userlabels">Delivery time:</label><span className="uservalues">{campaign.hours?campaign.hours+":"+campaign.minutes+" "+campaign.ampm:""}</span></li>
                    <li><label className="userlabels">Time Zone:</label><span className="uservalues">{campaign.timeZone?campaign.timeZone:''}</span></li>
                    <li><label className="userlabels">Created by:</label><span className="uservalues">{campaign.name}</span></li>
                    <li><label className="userlabels">Created at:</label><span className="uservalues">{new Date(campaign.createdAt).toLocaleDateString()}</span></li>                   
                    <li><label className="userlabels">Content:</label></li>
                    <Editor style={{ height: '320px' }} value={campaign.content} name="content"/>
                </ul>
            </Card>
        </div>
     );
}
 
export default ViewCampaign;