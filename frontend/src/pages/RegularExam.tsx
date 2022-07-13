import "./RegularExam.scss";

import React from "react";
import { useState, useEffect, ReactNode } from "react";
import colors from "../colors.module.scss";
import Card from "../components/Card";
import ZoomImage from "../components/ZoomImage";
import { apiGetAnatomy, apiGetCategories, apiSubmitResult } from "../api";
import Button from "../components/Button";
import { Link } from "wouter";
import ProgressBar from "../components/ProgressBar";
import { mdiCheckCircleOutline, mdiClockOutline, mdiCloseCircleOutline, mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import { useAuth } from "../auth";
import seedrandom from "seedrandom";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    selectionRadius: number,
    title: string,
    img: any,
    tip: string,
    key: string,
    modes: Array<"img" | "text">
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
                radius: str.selectionRadius,
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

function QuestionText({ currentStructure, timed, onSuccess, onFailure, onTimeout }: { currentStructure?: AnatomicStructure, timed: boolean, onSuccess: (result: string) => void, onFailure: (result: string) => void, onTimeout: () => void }) {
    let [showHint, setShowHint] = useState(false);
    let [submission, setSubmission] = useState("");

    console.log(currentStructure);

    return (
        <div className="learn-container">
            <div style={{ height: "max(300px, calc(100vh - 370px))", flexGrow: 2 }}>
                <ZoomImage
                    pMarkers={!!currentStructure ? [{
                        centerX: currentStructure.centerX,
                        centerY: currentStructure.centerY,
                        radius: currentStructure.selectionRadius / 10,
                        markerWidth: 1,
                        markerColor: colors["error-color"],
                        clickable: false,
                        onClick: null,
                    }] : undefined}
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
                        <span className="exam-prompt">Was ist der Name des angezeigten Knochens?</span>
                        <form onSubmit={() => {
                            if (testUserSubmission(currentStructure!, submission)) {
                                onSuccess(submission);
                            } else {
                                onFailure(submission);
                            }
                        }}>
                            <div className="exam-text-mode-submit">
                                <Input autoFocus onChanged={e => { setSubmission(e.target.value); }}></Input>
                                <Button type="submit" onClick={() => { }}>Absenden</Button>
                            </div>
                        </form>
                        <div className="exam-hint-container">
                            <IconButton inverted={true} color="accent" onClick={() => { setShowHint(!showHint); }} icon={mdiInformationOutline}></IconButton>
                            {showHint ? <div>Tipp: {currentStructure?.tip}</div> : undefined}
                        </div>
                    </div>
                </div>
                <div className="learn-button-spacer"></div>
                {timed ? <Timer timerSeconds={10} onElapsed={() => {
                    if (testUserSubmission(currentStructure!, submission)) {
                        onSuccess(submission);
                    } else {
                        onTimeout();
                    }
                }} /> : null}
            </div>
        </div>
    );
}

const quotes_correct = [
    "Omg du bist der geilste, Bruder! Du hast voll recht mit \"{correct}\"!!!"
];

const quotes_empty = [
    "Du hast garnix eingegeben digga, eigentlich wäre es \"{correct}\", smh....."
];

const quotes_wrong = [
    "Meine Güte, das ist doch nicht \"{wrong}\", das ist \"{correct}\", smh....."
];

const quotes_slow = [
    "Das war ja eigentlich der \"{correct}\", aber du hast ja noch gewartet dass die Schnecke die Straße überquert."
];

function Correct({ next, structure }: { next: (e: any) => void, structure: AnatomicStructure }) {
    const select = (list: any) => {
        let i = Math.round(Math.random() * (list.length - 1));
        return list[i];
    }

    let text = select(quotes_correct);

    function cont(e: any) {
        e.preventDefault();
        next(e);
    }

    return (
        <div>
            <span style={{ fontSize: "28px" }}>{text.replace("{correct}", structure.title)}</span>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "32px" }}>
                <div style={{ flexGrow: 1 }}></div>
                <form onSubmit={cont}>
                    <Button autoFocus type="submit" size="large" color="accent" onClick={() => { }}>Nächste</Button>
                </form>
            </div>
        </div>
    );
}

function Wrong({ next, structure, submission }: { next: (e: any) => void, structure: AnatomicStructure, submission: any }) {
    const select = (list: any) => {
        let i = Math.round(Math.random() * (list.length - 1));
        return list[i];
    }

    let text = select(submission ? quotes_wrong : quotes_empty);

    function cont(e: any) {
        e.preventDefault();
        next(e);
    }

    return (
        <div>
            <span style={{ fontSize: "28px" }}>{text.replace("{wrong}", submission).replace("{correct}", structure.title)}</span>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "32px" }}>
                <div style={{ flexGrow: 1 }}></div>
                <form onSubmit={cont}>
                    <Button autoFocus type="submit" size="large" color="accent" onClick={() => { }}>Nächste</Button>
                </form>
            </div>
        </div>
    );
}

function Timeout({ next, structure }: { next: (e: any) => void, structure: AnatomicStructure }) {
    const select = (list: any) => {
        let i = Math.round(Math.random() * (list.length - 1));
        return list[i];
    }

    let text = select(quotes_slow);

    function cont(e: any) {
        e.preventDefault();
        next(e);
    }

    return (
        <div>
            <span style={{ fontSize: "28px" }}>{text.replace("{correct}", structure.title)}</span>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "32px" }}>
                <div style={{ flexGrow: 1 }}></div>
                <form onSubmit={cont}>
                    <Button autoFocus type="submit" size="large" color="accent" onClick={() => { }}>Nächste</Button>
                </form>
            </div>
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

function Finished({ correct, wrong, slow }: { correct: Array<AnatomicStructure>, wrong: Array<AnatomicStructure>, slow: Array<AnatomicStructure> }) {
    let auth = useAuth();
    let correctPercentage = Math.floor(100.0 * (correct.length / (correct.length + wrong.length + slow.length)));
    let correctWithStatus = correct.map(e => { (e as any).status = "correct"; return e; });
    let wrongWithStatus = wrong.map(e => { (e as any).status = "wrong"; return e; });
    let slowWithStatus = slow.map(e => { (e as any).status = "slow"; return e; });
    let resultsList: Array<any> = correctWithStatus.concat(slowWithStatus).concat(wrongWithStatus);

    useEffect(() => {
        const upload = async () => {
            let result = {
                correct: correct.map(r => r.key),
                wrong: wrong.map(r => r.key),
                slow: slow.map(r => r.key),
            }
            await apiSubmitResult(result, auth.session.token);
        };
        upload();
    }, [correct, wrong, slow]);

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

function getNextMode(textMode: boolean, imageMode: boolean, supportedModes: Array<"img" | "text">): ExamMode {
    let options = [];
    if (textMode && supportedModes.includes("text")) {
        options.push(ExamMode.AskText);
    }
    if (imageMode && supportedModes.includes("img")) {
        options.push(ExamMode.AskImage);
    }
    if (options.length === 0) {
        return null!;
    } else {
        let index = Math.round(Math.random() * (options.length - 1));
        return options[index];
    }
}

function RegularExam({ textMode, imageMode, timed, category }: { category: string, textMode: boolean, imageMode: boolean, timed: boolean }) {
    let [structures, setStructures] = useState<Array<AnatomicStructure>>([]);
    let [currentIndex, setCurrentIndex] = useState<number>(0);

    let currentStructure: AnatomicStructure = structures.length > 0 ? structures[currentIndex] : null!;

    let [userSubmission, setUserSubmission] = useState<any>(null!);
    let [mode, setMode] = useState(ExamMode.AskImage);

    useEffect(() => {
        if (currentStructure) {
            let startMode = getNextMode(textMode, imageMode, currentStructure.modes);
            setMode(startMode);
        }
    }, [currentStructure])

    useEffect(() => {
        const getInfo = async () => {
            let resp = await apiGetAnatomy();
            let rawData = null;
            if (resp.ok) {
                rawData = await resp.json();
            }
            let categories = await apiGetCategories();
            let foundCategory = categories.find(c => c.key === category)!;

            let half_secs = Math.round(Date.now() / 2000);
            let rng = seedrandom(half_secs.toString());

            function shuffle(a: Array<any>) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(rng() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            }

            let matchingStructures = rawData.filter((elem: any) => foundCategory.elements.includes(elem.key)).map(
                (elem: any) => {
                    return {
                        centerX: elem.imgPosX,
                        centerY: elem.imgPosY,
                        radius: elem.radius,
                        selectionRadius: elem.selectionRadius,
                        title: elem.name,
                        img: elem.img,
                        key: elem.key,
                        tip: elem.tip,
                        modes: elem.examModes
                    };
                }
            );
            console.log("setstrcututreurss");
            setStructures(shuffle(matchingStructures));
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
            let i = 1;
            while (true) {
                if (currentIndex + i === structures.length) {
                    setMode(ExamMode.Finished);
                    break;
                }
                let newMode = getNextMode(textMode, imageMode, structures[currentIndex + i].modes);
                if (newMode === null) {
                    i++;
                    continue;
                }
                setMode(newMode);
                setCurrentIndex(currentIndex + i);
                break;
            }
        }
    }

    useEffect(() => {
        console.log(currentStructure);
    }, [currentStructure]);

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
                                    onSuccess={(result: string) => {
                                        addCorrect(currentStructure);
                                        setUserSubmission(result);
                                        setMode(ExamMode.Success);
                                    }}
                                    onFailure={(result: string) => {
                                        addWrong(currentStructure);
                                        setUserSubmission(result);
                                        setMode(ExamMode.Failure);
                                    }}
                                    onTimeout={() => {
                                        addSlow(currentStructure);
                                        setMode(ExamMode.Timeout);
                                    }} />;
                            case ExamMode.Success:
                                return <Correct structure={currentStructure} next={askNext} />;
                            case ExamMode.Failure:
                                return <Wrong structure={currentStructure} submission={userSubmission} next={askNext} />;
                            case ExamMode.Timeout:
                                return <Timeout structure={currentStructure} next={askNext} />;
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