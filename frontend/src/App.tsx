import './App.scss';
import logo from "./logo.svg";

import { mdiAccount, mdiHome } from '@mdi/js'
import IconButton from './components/IconButton';

import Home from './pages/Home';
import Login from './pages/Login';

import { Link, Redirect, Route, Switch } from "wouter";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider, RequireAuth, useAuth } from './auth';

function HomeOrLogin() {
    let auth = useAuth();

    let isHome = !!auth.session.token;

    return (
        <Link to={isHome ? "/dashboard" : "/login"}>
            <IconButton inverted={true} color="primary" size="small" icon={isHome ? mdiHome : mdiAccount} onClick={() => { }}></IconButton>
        </Link>
    );
}

function App() {
    return (
        <AuthProvider>
            <div className="page-container">
                <div className="page-app-bar">
                    <Link to="/" className='home-link'>
                        <img src={logo} alt="Logo" height={48}></img>
                        <div className="app-bar-title">Skelearn</div>
                    </Link>
                    <div className="app-bar-spacer"></div>
                    <HomeOrLogin></HomeOrLogin>
                </div>
                <div className='content'>
                    <Switch>
                        <Route path="/" ><Home /></Route>
                        <Route path="/login" ><Login /></Route>
                        <Route path="/register" ><Register /></Route>
                        <Route path="/dashboard" ><RequireAuth fallback={<Redirect to="/login" />}><Dashboard /></RequireAuth></Route>
                        <Route path="/:rest"><Redirect to="/" /></Route>
                    </Switch>
                </div>
                <div className='footer-spacer'></div>
                <div className='page-footer'>
                    Copyright oder sowas, außerdem haben wir ein Impressum (impressive, I know).
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;