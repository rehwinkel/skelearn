import Card from "../components/Card";
import "./Learn.scss";

import accurateSkel from "../accurate-skeleton.png";
import accurateSkelSide from "../accurate-skeleton-side.png";
import IconButton from "../components/IconButton";
import { mdiArrowCollapse, mdiArrowLeft, mdiArrowRight, mdiMoveResize, mdiSetCenter } from "@mdi/js";
import ZoomImage from "../components/ZoomImage";
import { useEffect, useState } from "react";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    description: string,
    img: any,
}

function Learn() {
    let [currentStructure, setCurrentStructure] = useState<AnatomicStructure>(null!);
    let structures: Array<AnatomicStructure> = [
        {
            centerX: 730,
            centerY: 1130,
            radius: 125,
            title: "Femur",
            description: "Der <b>Femur</b> ist der geilste Knochen im Oberschenkel.\nEr besteht aus Knochen.",
            img: accurateSkel,
        },
        {
            centerX: 215,
            centerY: 570,
            radius: 105,
            title: "Humerus",
            description: "Der Humerus, auch als LMAO-Knochen bekannt, kostet etwa 6,50€.",
            img: accurateSkel,
        },
        {
            centerX: 290,
            centerY: 540,
            radius: 210,
            title: "Skull",
            description: "Das ist halt einfach ein Kopf du Dickschädel.",
            img: accurateSkelSide,
        },
        {
            centerX: 300,
            centerY: 510,
            radius: 15,
            title: "Tear",
            description: "Sad :(",
            img: accurateSkelSide,
        }
    ];

    useEffect(() => {
        setTimeout(() => {
            setCurrentStructure(structures[3]);
        }, 1000);
    }, [setCurrentStructure]);

    return (
        <Card style={{ width: "80%" }} loading={currentStructure === null}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Lernmodus</span>
            </div>
            <div className="learn-container">
                <div style={{ height: "max(300px, calc(100vh - 370px))" }}>
                    <ZoomImage
                        src={currentStructure?.img}
                        position={!!currentStructure ? {
                            x: currentStructure.centerX,
                            y: currentStructure.centerY,
                            size: currentStructure.radius,
                        } : undefined} />
                </div>
                <div className="learn-right">
                    <div style={{ display: "flex" }}>
                        <div style={{ flexGrow: 1 }}>
                            <span className="learn-title">{currentStructure?.title || "Loading..."}</span>
                            <p className="learn-text" >
                                {currentStructure?.description || "Loading..."}
                            </p>
                        </div>
                        <IconButton icon={mdiArrowCollapse} onClick={() => { }}></IconButton>
                    </div>
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