import "./Home.scss";

import Button from "../components/Button";
import colors from "../colors.module.scss";

import { Link, useLocation } from "wouter";

function Home() {
    return (
        <div>
            <div className="title-area">
                <span className="title">Ske<span style={{ color: colors["accent-color"] }}>learn</span></span>
            </div>
            <div className="content-area">
                <span className='slogan'>Learn bones - become a boner.</span>
                <Link to="/dashboard">
                    <Button size='large' color='accent' onClick={() => { }}>Jetzt loslegen!</Button>
                </Link>
            </div>
        </div>
    );
}

export default Home;