import "./RegularExam.scss";

import { useState, useEffect } from "react";
import colors from "../colors.module.scss";
import Card from "../components/Card";
import ZoomImage from "../components/ZoomImage";
import { apiGetAnatomy } from "../api";
import Button from "../components/Button";
import { Link } from "wouter";
import ProgressBar from "../components/ProgressBar";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    img: any,
    tip: string,
    key: string,
}

function Timer({ onElapsed, timerSeconds }: { onElapsed: () => void, timerSeconds: number }) {
    let [elapsed, setElapsed] = useState(0);
    let progress = elapsed / timerSeconds;

    useEffect(() => {
        setTimeout(() => {
            if (elapsed >= timerSeconds) {
                onElapsed();
            } else {
                setElapsed(elapsed + 0.1);
            }
        }, 100);
    }, [elapsed, setElapsed]);

    return (
        <div>
            <div className="timer-text">
                <span>{Math.floor(elapsed / 60) + ":" + ((Math.floor(elapsed) % 60) >= 10 ? "" : "0") + (Math.floor(elapsed) % 60)}</span>
                <div style={{ flexGrow: 1 }}></div>
                <span>{Math.floor(timerSeconds / 60) + ":" + ((timerSeconds % 60) >= 10 ? "" : "0") + (timerSeconds % 60)}</span>
            </div>
            <ProgressBar color={colors["accent-color-dark"]} progress={progress}></ProgressBar>
        </div>
    );
}

function QuestionImage({ structures, currentStructure, timed, onSuccess, onFailure, onTimeout }: { structures: Array<AnatomicStructure>, currentStructure?: AnatomicStructure, timed: boolean, onSuccess: () => void, onFailure: () => void, onTimeout: () => void }) {
    let markers = structures.filter(str => str.img === currentStructure?.img).map(
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
                </div>
                <div className="learn-button-spacer"></div>
                {timed ? <Timer timerSeconds={10} onElapsed={onTimeout} /> : null}
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

function Timeout({ next }: { next: (e: any) => void }) {
    return (
        <div>
            Du bist langsamer als meine verstorbene Großmutter!
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
    Timeout,
    Finished,
}

function SpacedRepExam({ textMode, imageMode, timed }: { textMode: boolean, imageMode: boolean, timed: boolean }) {
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
                <span className="card-title">Reguläre Abfrage</span>
            </div>
            <div>
                {
                    (() => {
                        switch (mode) {
                            case ExamMode.AskImage:
                                return <QuestionImage structures={structures}
                                    currentStructure={currentStructure}
                                    timed={timed}
                                    onSuccess={() => {
                                        setMode(ExamMode.Success);
                                    }}
                                    onFailure={() => {
                                        setMode(ExamMode.Failure);
                                    }}
                                    onTimeout={() => {
                                        setMode(ExamMode.Timeout);
                                    }} />;
                            case ExamMode.AskText:
                                return <QuestionText />;
                            case ExamMode.Success:
                                return <Correct next={askNext} />;
                            case ExamMode.Failure:
                                return <Wrong next={askNext} />;
                            case ExamMode.Timeout:
                                return <Timeout next={askNext} />;
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