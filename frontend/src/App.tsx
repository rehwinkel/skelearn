import './App.scss';

import { mdiAccount } from '@mdi/js'
import IconButton from './components/IconButton';

import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';

function App() {
    function test(e: any) {
        console.log("nice", e);
    }

    return (
        <BrowserRouter>
            <div className="page-container">
                <div className="page-app-bar">
                    <img src="/logo.svg" alt="Logo" height={48}></img>
                    <div className="app-bar-title">Skelearn</div>
                    <div className="app-bar-spacer"></div>
                    <Link to={"/login"}>
                        <IconButton inverted={true} color="primary" size="small" icon={mdiAccount} onClick={test}></IconButton>
                    </Link>
                </div>
                <div className='content'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <div className='footer-spacer'></div>
                <div className='page-footer'>
                    Copyright oder sowas, außerdem haben wir ein Impressum (impressive, I know).
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
