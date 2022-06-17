import "./Home.scss";

import Button from "../components/Button";
import colors from "../colors.module.scss";
import { useNavigate } from "react-router-dom";

function Home() {
    let navigate = useNavigate();

    function goToAppOrLogin(e: any) {
        navigate("/login", { replace: true });
    }

    return (
        <div>
            <div className="title-area">
                <span className="title">Ske<span style={{ color: colors["accent-color"] }}>learn</span></span>
            </div>
            <div className="content-area">
                <span className='slogan'>Learn bones - become a boner.</span>
                <Button size='large' color='accent' onClick={goToAppOrLogin}>Jetzt loslegen!</Button>
            </div>
        </div>
    );
}

export default Home;