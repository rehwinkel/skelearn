import "./RegularExam.scss";

import { useState, useEffect, ReactNode } from "react";
import colors from "../colors.module.scss";
import Card from "../components/Card";
import ZoomImage from "../components/ZoomImage";
import { apiGetAnatomy, apiGetCategories } from "../api";
import Button from "../components/Button";
import { Link } from "wouter";
import ProgressBar from "../components/ProgressBar";
import { mdiCheckCircleOutline, mdiClockOutline, mdiCloseCircleOutline, mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";
import IconButton from "../components/IconButton";
import Input from "../components/Input";

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

    let [showHint, setShowHint] = useState(false);

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
                        <span className="exam-prompt">Klicke auf den: <br /> <b>{currentStructure?.title}</b></span>
                        <div className="exam-hint-container">
                            <IconButton inverted={true} color="accent" onClick={() => { setShowHint(!showHint); }} icon={mdiInformationOutline}></IconButton>
                            {showHint ? <div>Tipp: {currentStructure?.tip}</div> : undefined}
                        </div>
                    </div>
                </div>
                <div className="learn-button-spacer"></div>
                {timed ? <Timer timerSeconds={10} onElapsed={onTimeout} /> : null}
            </div>
        </div>
    );
}

function testUserSubmission(structure: AnatomicStructure, name: string): boolean {
    // TODO: expand possibly?
    return structure.title.toLowerCase() === name.toLowerCase();
}

function QuestionText({ currentStructure, timed, onSuccess, onFailure, onTimeout }: { currentStructure?: AnatomicStructure, timed: boolean, onSuccess: () => void, onFailure: () => void, onTimeout: () => void }) {
    let [showHint, setShowHint] = useState(false);
    let [submission, setSubmission] = useState("");

    return (
        <div className="learn-container">
            <div style={{ height: "max(300px, calc(100vh - 370px))", flexGrow: 2 }}>
                <ZoomImage
                    src={currentStructure?.img}
                    position={currentStructure ? { x: currentStructure?.centerX, y: currentStructure?.centerY, size: currentStructure?.radius * 2 } : undefined} />
            </div>
            <div className="learn-right">
                <div style={{ display: "flex" }}>
                    <div style={{ flexGrow: 1 }}>
                        <span className="exam-prompt">Was ist der Name des angezeigten Knochens?</span>
                        <div className="exam-text-mode-submit">
                            <Input onChanged={e => { setSubmission(e.target.value); }}></Input>
                            <Button onClick={() => {
                                if (testUserSubmission(currentStructure!, submission)) {
                                    onSuccess();
                                } else {
                                    onFailure();
                                }
                            }}>Absenden</Button>
                        </div>
                        <div className="exam-hint-container">
                            <IconButton inverted={true} color="accent" onClick={() => { setShowHint(!showHint); }} icon={mdiInformationOutline}></IconButton>
                            {showHint ? <div>Tipp: {currentStructure?.tip}</div> : undefined}
                        </div>
                    </div>
                </div>
                <div className="learn-button-spacer"></div>
                {timed ? <Timer timerSeconds={10} onElapsed={() => {
                    if (testUserSubmission(currentStructure!, submission)) {
                        onSuccess();
                    } else {
                        onTimeout();
                    }
                }} /> : null}
            </div>
        </div>
    );
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

function ResultItem({ first, last, status, children }: { first: boolean, last: boolean, status: "correct" | "wrong" | "slow", children?: ReactNode }) {
    return (
        <div className="result-list-item" style={{
            borderTopLeftRadius: first ? "16px" : undefined,
            borderTopRightRadius: first ? "16px" : undefined,
            borderBottomLeftRadius: last ? "16px" : undefined,
            borderBottomRightRadius: last ? "16px" : undefined
        }}>
            <span>{children}</span>
            <div style={{ flexGrow: 1 }}></div>
            <Icon size={1} color={
                status === "correct" ? colors["success-color"] :
                    (status === "slow" ? colors["warn-color"] : colors["error-color"])}
                path={
                    status === "correct" ? mdiCheckCircleOutline :
                        (status === "slow" ? mdiClockOutline : mdiCloseCircleOutline)}></Icon>
        </div>
    );
}

// TODO: save the progress
function Finished({ correct, wrong, slow }: { correct: Array<AnatomicStructure>, wrong: Array<AnatomicStructure>, slow: Array<AnatomicStructure> }) {
    let correctPercentage = Math.floor(100.0 * (correct.length / (correct.length + wrong.length + slow.length)));
    let correctWithStatus = correct.map(e => { (e as any).status = "correct"; return e; });
    let wrongWithStatus = wrong.map(e => { (e as any).status = "wrong"; return e; });
    let slowWithStatus = slow.map(e => { (e as any).status = "slow"; return e; });
    let resultsList: Array<any> = correctWithStatus.concat(slowWithStatus).concat(wrongWithStatus);

    return (
        <div className="exam-results">
            <div>
                <span>Du hattest {correctPercentage > 0 ? ((correctPercentage < 50 ? "nur " : "") + correctPercentage + "%") : "garnichts"} richtig! </span>
                {correctPercentage < 50 ?
                    <span>
                        Du solltest vielleicht nochmal in den <Link to="/learn" style={{ color: colors["text-color"], textDecorationLine: "underline" }}>Lernmodus</Link> wechseln.
                    </span> : null}
            </div>
            <div className="result-list-container">
                <span className="result-list-title">Ergebnisse</span>
                <div className="result-list">
                    {(resultsList).map((r: any, i: number) => {
                        return <ResultItem key={i} first={i === 0} last={i === resultsList.length - 1} status={r.status}>{r.title}</ResultItem>
                    })}
                </div>
            </div>
            <div className="result-back-home">
                <div style={{ flexGrow: 1 }} />
                <Link to="/dashboard">
                    <Button size="large" onClick={() => { }}>Zum Dashboard</Button>
                </Link>
            </div>
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

function getNextMode(textMode: boolean, imageMode: boolean): ExamMode {
    let options = [];
    if (textMode) {
        options.push(ExamMode.AskText);
    }
    if (imageMode) {
        options.push(ExamMode.AskImage);
    }
    let index = Math.round(Math.random() * (options.length - 1));
    console.log(options, index);
    return options[index];
}

function RegularExam({ textMode, imageMode, timed, category }: { category: string, textMode: boolean, imageMode: boolean, timed: boolean }) {
    let [structures, setStructures] = useState<Array<AnatomicStructure>>([]);
    let [currentIndex, setCurrentIndex] = useState<number>(0);
    let currentStructure: AnatomicStructure = structures.length > 0 ? structures[currentIndex] : null!;

    console.log(textMode, imageMode);
    let [mode, setMode] = useState(getNextMode(textMode, imageMode));

    useEffect(() => {
        const getInfo = async () => {
            let rawData = await apiGetAnatomy(); 
            let categories = await apiGetCategories();
            let foundCategory = categories.find(c => c.name === category)!;

            setStructures(rawData.filter(elem => foundCategory.elements.includes(elem.name)).map(
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

    let [correct, setCorrect] = useState<Array<AnatomicStructure>>([]);
    let [wrong, setWrong] = useState<Array<AnatomicStructure>>([]);
    let [slow, setSlow] = useState<Array<AnatomicStructure>>([]);

    const addCorrect = (e: AnatomicStructure) => {
        setCorrect([e, ...correct])
    }

    const addWrong = (e: AnatomicStructure) => {
        setWrong([e, ...wrong])
    }

    const addSlow = (e: AnatomicStructure) => {
        setSlow([e, ...slow])
    }

    function askNext() {
        if (currentIndex + 1 === structures.length) {
            setMode(ExamMode.Finished);
        } else {
            setMode(getNextMode(textMode, imageMode));
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
                                        addCorrect(currentStructure);
                                        setMode(ExamMode.Success);
                                    }}
                                    onFailure={() => {
                                        addWrong(currentStructure);
                                        setMode(ExamMode.Failure);
                                    }}
                                    onTimeout={() => {
                                        addSlow(currentStructure);
                                        setMode(ExamMode.Timeout);
                                    }} />;
                            case ExamMode.AskText:
                                return <QuestionText currentStructure={currentStructure}
                                    timed={timed}
                                    onSuccess={() => {
                                        addCorrect(currentStructure);
                                        setMode(ExamMode.Success);
                                    }}
                                    onFailure={() => {
                                        addWrong(currentStructure);
                                        setMode(ExamMode.Failure);
                                    }}
                                    onTimeout={() => {
                                        addSlow(currentStructure);
                                        setMode(ExamMode.Timeout);
                                    }} />;
                            case ExamMode.Success:
                                return <Correct next={askNext} />;
                            case ExamMode.Failure:
                                return <Wrong next={askNext} />;
                            case ExamMode.Timeout:
                                return <Timeout next={askNext} />;
                            case ExamMode.Finished:
                                return <Finished correct={correct} wrong={wrong} slow={slow} />;
                        }
                    })()
                }
            </div>
        </Card>
    );
}

export default RegularExam;