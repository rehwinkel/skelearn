import Card from "../components/Card";
import "./Learn.scss";

import accurateSkel from "../accurate-skeleton.png";
import accurateSkelSide from "../accurate-skeleton-side.png";
import IconButton from "../components/IconButton";
import { mdiArrowCollapse, mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import ZoomImage from "../components/ZoomImage";
import { useEffect, useReducer, useState } from "react";
import { apiGetAnatomy } from "../api";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    description: string,
    img: any,
}

function Learn() {
    let [currentIndex, setCurrentIndex] = useState<number>(0);
    let [structures, setStructures] = useState<Array<AnatomicStructure>>([]);
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    useEffect(() => {
        const getInfo = async () => {
            let rawData = await apiGetAnatomy();
            setStructures(rawData.map(
                elem => {
                    return {
                        centerX: elem.imgPosX,
                        centerY: elem.imgPosY,
                        radius: elem.radius,
                        title: elem.name,
                        description: elem.description,
                        img: elem.img
                    };
                }
            ));
        };
        getInfo();
    }, [setStructures]);

    let currentStructure = structures.length > 0 ? structures[currentIndex] : null;

    function next(c: number) {
        setCurrentIndex((currentIndex + c + structures.length) % structures.length);
    }

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
                        <IconButton icon={mdiArrowCollapse} onClick={() => { forceUpdate(); }}></IconButton>
                    </div>
                    <div className="learn-button-spacer"></div>
                    <div className="learn-buttons">
                        <IconButton icon={mdiArrowLeft} onClick={() => { next(-1); }}></IconButton>
                        <span>
                            <span>Previous</span>
                        </span>
                        <div>
                        </div>
                        <span>
                            <span>Next</span>
                        </span>
                        <IconButton icon={mdiArrowRight} onClick={() => { next(1); }}></IconButton>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default Learn;