import Card from "../components/Card";
import "./Learn.scss";

import accurateSkel from "../accurate-skeleton.png";
import IconButton from "../components/IconButton";
import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import ZoomImage from "../components/ZoomImage";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    description: string,
}

function Learn() {
    let structures: Array<AnatomicStructure> = [
        {
            centerX: 730,
            centerY: 1130,
            radius: 125,
            title: "Femur",
            description: "Der <b>Femur</b> ist der geilste Knochen im Oberschenkel.\nEr besteht aus Knochen."
        }
    ];

    let current_structure: AnatomicStructure = structures[0];

    return (
        <Card style={{ width: "80%" }}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Lernmodus</span>
            </div>
            <div className="learn-container">
                <div style={{ height: "max(300px, calc(100vh - 370px))" }}>
                    <ZoomImage
                        src={accurateSkel}
                        position={{
                            x: current_structure.centerX,
                            y: current_structure.centerY,
                            size: current_structure.radius
                        }} />
                </div>
                <div className="learn-right">
                    <span className="learn-title">{current_structure.title}</span>
                    <p className="learn-text" >
                        {current_structure.description}
                    </p>
                    <div className="learn-button-spacer"></div>
                    <div className="learn-buttons">
                        <IconButton icon={mdiArrowLeft} onClick={() => { }}></IconButton>
                        <span>
                            <span>Previous</span>
                        </span>
                        <div>
                        </div>
                        <span>
                            <span>Next</span>
                        </span>
                        <IconButton icon={mdiArrowRight} onClick={() => { }}></IconButton>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default Learn;