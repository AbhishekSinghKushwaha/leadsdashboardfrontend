import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import DisplayData from '../display';
import Inprocess from './inProcess';
import Project from './project';
import Piloet from './piloet';
import Connectback from './connectBack';
import Stopped from './stopped';
import Todo from './todo'
import Campaign from './campaign/campaign';
import Segments from './segments/segments';
import Tags from './tags/tag';

const Tab = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    return ( 
        <div className="tabs">
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <TabPanel header="Leads">
                    <DisplayData/>
                </TabPanel>
                <TabPanel header="In-Process">
                    <Inprocess/>
                </TabPanel>
                <TabPanel header="Project">
                    <Project/>
                </TabPanel>
                <TabPanel header="Piloet">
                    <Piloet/>
                </TabPanel>
                <TabPanel header="Connect Back">
                    <Connectback/>
                </TabPanel>
                <TabPanel header="Stopped">
                    <Stopped/>
                </TabPanel>
                <TabPanel header="Campaign">
                    <Campaign/>
                </TabPanel>
                <TabPanel header="Segments">
                    <Segments/>
                </TabPanel>
                <TabPanel header="Tags">
                    <Tags/>
                </TabPanel>
                <TabPanel header="Todo List">
                    <Todo/>
                </TabPanel>
            </TabView>
        </div>
    );
}
 
export default Tab;