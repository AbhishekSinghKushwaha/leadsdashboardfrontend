import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './component/navbar';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import ViewDetails from './component/viewDetails';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Auth from './component/auth';
import Tab from './component/tabs/tab';
import PageNotFound from './component/pageNotFound';
import NewCampaign from './component/tabs/campaign/newCampaign';
import ViewCampaign from './component/tabs/campaign/viewCampaign';
import NewSegment from './component/tabs/segments/newSegment';
import ViewSegment from './component/tabs/segments/viewSegment';
import TagLeads from './component/tabs/tags/viewTagsLeads';

function App() {

  return (
    <Router>
    <div className="App">
    <Navbar/>
      <div className="content">
        <Switch>
          <Route exact path={["/", "/home"]}>
            <Tab/>
          </Route>
          <Route exact path="/view/:id" render={(props) => <ViewDetails {...props} />}>
          </Route>
          <Route exact path="/auth">
            <Auth/>
          </Route>
          <Route exact path={["/campaign", "/campaign/:id"]} render={(props) => <NewCampaign {...props} />}>
          </Route>
          <Route exact path="/viewcampaign/:id" render={(props) => <ViewCampaign {...props} />}>
          </Route>
          <Route exact path={["/segment", "/segment/:id"]} render={(props) => <NewSegment {...props} />}>
          </Route>
          <Route exact path="/viewsegment/:id" render={(props) => <ViewSegment {...props} />}>
          </Route>
          <Route exact path="/viewtagsleads/:tagName" render={(props) => <TagLeads {...props} />}>
          </Route>
          <Route>
            <PageNotFound/>
          </Route>
        </Switch>
      </div>
    </div>
    </Router>
  );
}

export default App;
