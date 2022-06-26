import './App.scss';
import logo from "./logo.svg";

import { mdiAccount } from '@mdi/js'
import IconButton from './components/IconButton';

import Home from './pages/Home';
import Login from './pages/Login';

import { Link, Redirect, Route, Switch } from "wouter";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <div className="page-container">
            <div className="page-app-bar">
                <Link to="/" className='home-link'>
                    <img src={logo} alt="Logo" height={48}></img>
                    <div className="app-bar-title">Skelearn</div>
                </Link>
                <div className="app-bar-spacer"></div>
                <Link to={"/login"}>
                    <IconButton inverted={true} color="primary" size="small" icon={mdiAccount} onClick={() => { }}></IconButton>
                </Link>
            </div>
            <div className='content'>
                <Switch>
                    <Route path="/" ><Home /></Route>
                    <Route path="/login" ><Login /></Route>
                    <Route path="/register" ><Register /></Route>
                    <Route path="/dashboard" ><Dashboard /></Route>
                    <Route path="/:rest"><Redirect to="/" /></Route>
                </Switch>
            </div>
            <div className='footer-spacer'></div>
            <div className='page-footer'>
                Copyright oder sowas, außerdem haben wir ein Impressum (impressive, I know).
            </div>
        </div>
    );
}

export default App;