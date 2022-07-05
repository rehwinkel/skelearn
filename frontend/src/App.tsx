import './App.scss';
import logo from "./logo.svg";

import { mdiAccount, mdiHome } from '@mdi/js'
import IconButton from './components/IconButton';

import Home from './pages/Home';
import Login from './pages/Login';

import { Link, Redirect, Route, Switch, useLocation } from "wouter";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider, RequireAuth, useAuth } from './auth';
import Learn from './pages/Learn';
import TimedExam from './pages/TimedExam';
import SpacedRepExam from './pages/SpacedRepExam';
import RealExam from './pages/RealExam';
import Impressum from './pages/Impressum';

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
    let [location, _] = useLocation();

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
                <div className='app-content' style={{ flexGrow: location === "/" ? 1 : 0 }}>
                    <Switch>
                        <Route path="/" ><Home /></Route>
                        <Route path="/login" ><Login /></Route>
                        <Route path="/register" ><Register /></Route>
                        <Route path="/dashboard" ><RequireAuth fallback={<Redirect to="/login" />}><Dashboard /></RequireAuth></Route>
                        <Route path="/learn" ><RequireAuth fallback={<Redirect to="/login" />}><Learn /></RequireAuth></Route>
                        <Route path="/impressum" ><Impressum /></Route>
                        <Route path="/exam/spaced/:txt/:img" >
                            {(params) => {
                                return (
                                    <RequireAuth fallback={<Redirect to="/login" />}>
                                        <SpacedRepExam textMode={params.txt === "yestxt"} imageMode={params.img === "yesimg"} />
                                    </RequireAuth>
                                );
                            }}
                        </Route>
                        <Route path="/exam/timed/:txt/:img" >
                            {(params) => {
                                return (
                                    <RequireAuth fallback={<Redirect to="/login" />}>
                                        <TimedExam textMode={params.txt === "yestxt"} imageMode={params.img === "yesimg"} />
                                    </RequireAuth>
                                );
                            }}
                        </Route>
                        <Route path="/exam/:txt/:img" >
                            {(params) => {
                                return (
                                    <RequireAuth fallback={<Redirect to="/login" />}>
                                        <RealExam textMode={params.txt === "yestxt"} imageMode={params.img === "yesimg"} />
                                    </RequireAuth>
                                );
                            }}
                        </Route>
                        <Route path="/:rest*"><Redirect to="/" /></Route>
                    </Switch>
                </div>
                <div style={{ flexGrow: location === "/" ? 0 : 1 }}></div>
                <div className='page-footer'>
                    Copyright oder sowas, außerdem haben wir ein Impressum (impressive, I know).
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;