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
<<<<<<< HEAD
=======
import RegularExam from './pages/RegularExam';
import RealExam from './pages/RealExam';
import Impressum from './pages/Impressum';
>>>>>>> 5d672037c48d928d9d0850717785f241304725cc
import Categories from './pages/Categories';

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
<<<<<<< HEAD
                        <Route path="/learn" ><RequireAuth fallback={<Redirect to="/login" />}><Learn /></RequireAuth></Route>
                        <Route path="/categories"><Categories /></Route>
                        <Route path="/:rest"><Redirect to="/" /></Route>
=======
                        <Route path="/categories" ><RequireAuth fallback={<Redirect to="/login" />}><Categories /></RequireAuth></Route>
                        <Route path="/learn/:category" >
                            {(params) => {
                                return (
                                    <RequireAuth fallback={<Redirect to="/login" />}><Learn category={params.category} /></RequireAuth>
                                );
                            }}
                        </Route>
                        <Route path="/impressum" ><Impressum /></Route>
                        <Route path="/exam/regular/:category/:txt/:img" >
                            {(params) => {
                                return (
                                    <RequireAuth fallback={<Redirect to="/login" />}>
                                        <RegularExam timed={true} category={params.category} textMode={params.txt === "yestxt"} imageMode={params.img === "yesimg"} />
                                    </RequireAuth>
                                );
                            }}
                        </Route>
                        <Route path="/exam/real/:category/:txt/:img" >
                            {(params) => {
                                return (
                                    <RequireAuth fallback={<Redirect to="/login" />}>
                                        <RealExam timed={true} category={params.category} textMode={params.txt === "yestxt"} imageMode={params.img === "yesimg"} />
                                    </RequireAuth>
                                );
                            }}
                        </Route>
                        <Route path="/:rest*"><Redirect to="/" /></Route>
>>>>>>> 5d672037c48d928d9d0850717785f241304725cc
                    </Switch>
                </div>
                <div style={{ flexGrow: location === "/" ? 0 : 1 }}></div>
                <div className='page-footer'>
                    <span>Copyright © 2022 by Ian Rehwinkel & Ikram Idderhem</span>
                    <span style={{ flexGrow: 1 }}></span>
                    <Link to="/impressum" style={{ color: "white", textDecorationLine: 'underline' }}>Impressum</Link>
                </div>
            </div>
        </AuthProvider>
    );
}

export default App;