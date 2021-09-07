import React, { useState, useEffect, useRef } from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import {fetchSegment, deleteSegment, filterSegment} from '../../../actions/segment';
import leadservice from '../../../services/leadservice';
import {fetchAll} from '../../../actions/posts';

const ViewSegment = (props) => {

    const emptySegment = {
        segmentName : "",
        subscribers : ""
    };

    const [fields, setFields] = useState([{ 
        activityType : "",
        campaignValue: "",
        campaignMatch : "",
        campaigns: "",
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

    const [segment, setSegment] = useState(emptySegment);
    const dispatch = useDispatch();

    console.log(fields, "fields")

    const tags = fields.map((data) => data.tags)
    console.log(tags, "TAGS")

    const posts = useSelector((state)=>state.posts);
    console.log(posts, "POSTS")

    // const filteredLeads = posts.filter((data, i) => {
    //     return (
    //         data.tags[0] === tags[1][1]
    //     )
    // })
    // console.log(filteredLeads,"filteredLeads")
    

    const getSegment = id => {
        leadservice.retriveSegment(id)
          .then(response => {
            setSegment({
                segmentName : response.data.segmentName,
                subscribers : response.data.subscribers
            });
            setFields(response.data.segmentDetails);
          })
          .catch(e => {
            console.log(e);
          });
    };   

    useEffect(() => {
        getSegment(props.match.params.id);  
        dispatch(fetchAll());
    }, [props.match.params.id, dispatch]);


    return ( 
        <div className="view-segment">
            <table class="styled-table">
        <thead>
            <tr>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
            </tr>
        </tbody>
</table>
        </div>
     );
}
 
export default ViewSegment;