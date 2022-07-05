import { mdiArrowCollapse } from "@mdi/js";
import { useReducer, useState, useEffect } from "react";
import colors from "../colors.module.scss";
import Card from "../components/Card";
import IconButton from "../components/IconButton";
import ZoomImage from "../components/ZoomImage";
import { apiGetAnatomy } from "../api";
import Button from "../components/Button";
import { Link } from "wouter";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    img: any,
    tip: string,
    key: string,
}

function QuestionImage({ structures, currentStructure, onSuccess, onFailure }: { structures: Array<AnatomicStructure>, currentStructure?: AnatomicStructure, onSuccess: () => void, onFailure: () => void }) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let markers = structures.map(
        str => {
            return {
                centerX: str.centerX,
                centerY: str.centerY,
                radius: str.radius,
                markerWidth: 3,
                markerColor: colors["accent-color"],
                clickable: true,
                onClick: () => {
                    if (str.key === currentStructure?.key) {
                        onSuccess();
                    } else {
                        onFailure();
                    }
                },
            };
        }
    );

    return (
        <div className="learn-container">
            <div style={{ height: "max(300px, calc(100vh - 370px))", flexGrow: 2 }}>
                <ZoomImage
                    pMarkers={markers}
                    src={currentStructure?.img} />
            </div>
            <div className="learn-right">
                <div style={{ display: "flex" }}>
                    <div style={{ flexGrow: 1 }}>
                        <span className="learn-title">Klicke auf den {currentStructure?.title}</span>
                        <div>Tipp: {currentStructure?.tip}</div>
                    </div>
                    <IconButton icon={mdiArrowCollapse} onClick={() => { forceUpdate(); }}></IconButton>
                </div>
                <div className="learn-button-spacer"></div>
                <div className="learn-buttons">
                    nice cock
                </div>
            </div>
        </div>
    );
}

function QuestionText() {
    return <div>FUCK YOU</div>;
}

function Correct({ next }: { next: (e: any) => void }) {
    return (
        <div>
            Das ist sau richtig Bro!
            <Button onClick={next}>Nächste</Button>
        </div>
    );
}

function Wrong({ next }: { next: (e: any) => void }) {
    return (
        <div>
            Du dummer Bastard!
            <Button onClick={next}>Nächste</Button>
        </div>
    );
}

function Finished() {
    return (
        <div>
            Finished
            <Link to="/dashboard">
                <Button onClick={() => { }}>Go Home sad :(</Button>
            </Link>
        </div>
    );
}

enum ExamMode {
    AskImage,
    AskText,
    Failure,
    Success,
    Finished,
}

function SpacedRepExam({ textMode, imageMode }: { textMode: boolean, imageMode: boolean }) {
    let [structures, setStructures] = useState<Array<AnatomicStructure>>([]);
    let [currentIndex, setCurrentIndex] = useState<number>(0);
    let currentStructure: AnatomicStructure = structures.length > 0 ? structures[currentIndex] : null!;

    let [mode, setMode] = useState(ExamMode.AskImage);

    useEffect(() => {
        const getInfo = async () => {
            let rawData = await apiGetAnatomy();
            setStructures(rawData.map(
                elem => {
                    return {
                        centerX: elem.imgPosX,
                        centerY: elem.imgPosY,
                        radius: elem.selectionRadius,
                        title: elem.name,
                        img: elem.img,
                        key: elem.name,
                        tip: elem.tip,
                    };
                }
            ));
        };
        getInfo();
    }, [setStructures]);

    function askNext() {
        if (currentIndex + 1 === structures.length) {
            setMode(ExamMode.Finished);
        } else {
            setMode(ExamMode.AskImage); // TODO: ask text too
            setCurrentIndex(currentIndex + 1);
        }
    }

    return (
        <Card style={{ width: "60%" }} loading={structures.length === 0}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Spaced-Repetition</span>
            </div>
            <div>
                {
                    (() => {
                        switch (mode) {
                            case ExamMode.AskImage:
                                return <QuestionImage structures={structures}
                                    currentStructure={currentStructure}
                                    onSuccess={() => {
                                        setMode(ExamMode.Success);
                                    }}
                                    onFailure={() => {
                                        setMode(ExamMode.Failure);
                                    }} />;
                            case ExamMode.AskText:
                                return <QuestionText />;
                            case ExamMode.Success:
                                return <Correct next={askNext} />;
                            case ExamMode.Failure:
                                return <Wrong next={askNext} />;
                            case ExamMode.Finished:
                                return <Finished />;
                        }
                    })()
                }
            </div>
        </Card>
    );
}

export default SpacedRepExam;