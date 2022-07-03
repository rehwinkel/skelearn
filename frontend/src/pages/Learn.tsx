import Card from "../components/Card";
import "./Learn.scss";

import accurateSkel from "../accurate-skeleton.png";
import IconButton from "../components/IconButton";
import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import ZoomImage from "../components/ZoomImage";

function Learn() {
    return (
        <Card style={{ width: "80%" }}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Lernmodus</span>
            </div>
            <div className="learn-container">
                <div style={{ height: "500px", width: "400px" }}>
                    <ZoomImage src={accurateSkel}></ZoomImage>
                </div>
                <div className="learn-right">
                    <span className="learn-title">Der Femur</span>
                    <p className="learn-text">
                        Der stabilste Knochen im Bein ist der Femur. <br></br>
                        Femur? Deine Mutter ist ein Lemur LOL.<br></br>
                        Nice caulk.
                    </p>
                    <div className="learn-button-spacer"></div>
                    <div className="learn-buttons">
                        <IconButton icon={mdiArrowLeft} onClick={() => { }}></IconButton>
                        <div>
                        </div>
                        <IconButton icon={mdiArrowRight} onClick={() => { }}></IconButton>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default Learn;