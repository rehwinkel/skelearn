import "./Home.scss";

import Button from "../components/Button";
import colors from "../colors.module.scss";

import { Link } from "wouter";
//Hiiiiiiiiiiiiii
function Home() {
    return (
        <div className="home-area">
            <div className="title-area">
                <span className="title">Ske<span style={{ color: colors["accent-color"] }}>learn</span></span>
            </div>
            <div className="content-area">
                <span className="slogan">Learn bones - become a boner.</span>
                <span className="disclaimer">
                    Diese Webseite ist ausschließlich für Fortbildungszwecke zu verwenden. <Link to="/impressum" style={{ color: "inherit", textDecorationLine: "underline" }}>Genaueres hier.</Link>
                </span>
                <Link to="/dashboard">
                    <Button size="large" color="accent" onClick={() => { }}>Jetzt loslegen!</Button>
                </Link>
            </div>
            <div className="about-us-seperator"></div>
            <div className="about-us-area">
                <span className="about-us-title">Über uns</span>
                <span className="about-us">
                    Wir sind Studenten, die leider Gottes damit beauftragt wurden,
                    eine verdammte Webseite zu bauen. Das Leiden ist groß, niemand hat Spaß,
                    aber immerhin sind die Farben schön.
                </span>
            </div>
        </div>
    );
}

export default Home;