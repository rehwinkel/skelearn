import "./Learn.scss";

import Card from "../components/Card";
import ZoomImage from "../components/ZoomImage";
import IconButton from "../components/IconButton";
import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import { useEffect, useState } from "react";
import { apiGetAnatomy, apiGetCategories } from "../api";
import React from "react";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    description: string,
    img: any,
}

interface Category {
    name: string,
    key: string,
    elements: Array<string>,
}

function Learn({ category }: { category: string }) {
    let [currentIndex, setCurrentIndex] = useState<number>(0);
    let [structures, setStructures] = useState<Array<AnatomicStructure>>([]);

    useEffect(() => {
        const getInfo = async () => {
            let resp = await apiGetAnatomy();
            let rawData = null;
            if (resp.ok) {
                rawData = await resp.json();
            }
            let categories: Array<Category>;
            let resp2 = await apiGetCategories();
            if (resp2.ok) {
                let data = await resp2.json();
                categories = data;
            }
            let foundCategory = categories.find(c => c.key === category)!;

            setStructures(rawData.filter((elem: any) => foundCategory.elements.includes(elem.key)).map(
                (elem: any) => {
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
        <Card style={{ width: "60%" }} loading={currentStructure === null}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Lernmodus</span>
            </div>
            <div className="learn-container">
                <div style={{ flexGrow: 2, height: "max(300px, calc(100vh - 370px))" }}>
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