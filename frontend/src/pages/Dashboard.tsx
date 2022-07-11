import "./Dashboard.scss";
import Card from "../components/Card";
import Select from "../components/Select";
import IconButton from "../components/IconButton";
import { mdiPencil, mdiTrashCanOutline } from "@mdi/js";
import Button from "../components/Button";
import { ReactNode, useEffect, useState } from "react";
import Check from "../components/Check";
import ProgressBar from "../components/ProgressBar";
import { Link, useLocation } from "wouter";
import Alert from "../components/Alert";
import { apiGetAnatomy, apiGetCategories, apiGetResults } from "../api";
import { useAuth } from "../auth";
import React from "react";

enum ExamMode {
    Regular,
    Real,
}

interface Category {
    name: string,
    key: string,
    elements: Array<string>,
}

function ResultItem({ first, last, children, progress }: { first: boolean, last: boolean, children?: ReactNode, progress: number }) {
    return (
        <div className="learn-result-list-item" style={{
            borderTopLeftRadius: first ? "16px" : undefined,
            borderTopRightRadius: first ? "16px" : undefined,
            borderBottomLeftRadius: last ? "16px" : undefined,
            borderBottomRightRadius: last ? "16px" : undefined
        }}>
            <div style={{ flexGrow: 1 }}>
                <span>{children}</span>
            </div>
            <div className="learn-results-item-progress">
                <span>{Math.floor(100 * progress)}%</span>
                <ProgressBar progress={progress}></ProgressBar>
            </div>
        </div>
    );
}

function Dashboard() {
    let auth = useAuth();
    let [_, setLocation] = useLocation();
    let [mode, setMode] = useState<ExamMode>(ExamMode.Regular);
    let [imageMode, setImageMode] = useState<boolean>(false);
    let [textMode, setTextMode] = useState<boolean>(false);
    let [category, setCategory] = useState("");

    let [structures, setStructures] = useState<Array<any>>([]);
    let [categories, setCategories] = useState<Array<Category>>([]);
    let [results, setResults] = useState<any>(null!);
    let [loadingResults, setLoadingResults] = useState<boolean>(false);

    useEffect(() => {
        let getInfo = async () => {
            setCategories(await apiGetCategories());
        };
        getInfo();
    }, [setCategories]);

    useEffect(() => {
        let getInfo = async () => {
            let resp = await apiGetAnatomy();
            if (resp.ok) {
                let anatomy = await resp.json();
                setStructures(anatomy);
            }
        };
        getInfo();
    }, [setStructures]);

    useEffect(() => {
        let getInfo = async () => {
            setLoadingResults(true);
            let response = await apiGetResults(auth.session.token);
            if (response && response.ok) {
                let data = await response.json();
                setResults(data);
            }
            setLoadingResults(false);
        };
        getInfo();
    }, [setResults, auth]);

    return (
        <div className="dashboard-container">
            <Card loading={loadingResults}>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Lernfortschritt</span>
                </div>
                {results === null || results.total_score === null ? <span>Du hast in deinem Leben nichts erreicht...</span> :
                    <div>
                        <div className="learn-progress-heading">
                            <span>Im Schnitt hast du {Math.floor(results.total_score * 100)}% der Fragen richtig beantwortet.</span>
                            <div style={{ flexGrow: 1 }}></div>
                            <IconButton style={{ flexShrink: 0 }} onClick={() => { /* TODO */ }} icon={mdiTrashCanOutline}></IconButton>
                        </div>
                        <span className="dashboard-section-title">Allgemeine Erfolgsquote ({Math.floor(results.total_score * 100)}%)</span>
                        <ProgressBar progress={results.total_score}></ProgressBar>
                        <span className="dashboard-section-title">Ergebnisse</span>
                        <div className="learn-result-list-container">
                            {
                                (() => {
                                    let entries: Array<[string, number]> = Object.entries(results.scores);
                                    entries.sort((a, b) => (b[1] - a[1] === 0 ? a[0].localeCompare(b[0]) : b[1] - a[1]));
                                    let elems = entries.map((entry, i: number) =>
                                        <ResultItem
                                            first={i === 0}
                                            last={i === structures.length - 1}
                                            progress={entry[1] as number}>
                                            {structures.find(str => str.key === entry[0]).name}
                                        </ResultItem>);
                                    return elems;
                                })()
                            }
                        </div>
                    </div>
                }
            </Card>
            <Card loading={false}>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Lernen</span>
                </div>
                <span className="dashboard-section-title">Kategorien</span>
                <div className="dashboard-categories">
                    <Select options={categories.map(c => { return { key: c.key, name: c.name + " (" + c.elements.length + ")" }; })} onSelected={(e) => { setCategory(e.target.value); }}></Select>
                    <Link to="/categories"><IconButton icon={mdiPencil} onClick={() => { }}></IconButton></Link>
                </div>
                {!category ?
                    <div style={{ marginTop: "8px" }}>
                        <Alert>Du musst eine Kategorie auswählen!</Alert>
                    </div>
                    : undefined}
                <span className="dashboard-section-title">Lernmodus</span>
                <Button size="large" onClick={() => { if (!category) return; setLocation("/learn/" + category) }}>Jetzt loslernen</Button>
                <span className="dashboard-section-title">Abfragemodus</span>
                <div className="dashboard-test-settings">
                    <div className="dashboard-mode-buttons">
                        <Button color="accent" inverted={mode !== ExamMode.Regular} onClick={() => { setMode(ExamMode.Regular) }}>Regulär</Button>
                        <Button color="accent" inverted={mode !== ExamMode.Real} onClick={() => { setMode(ExamMode.Real) }}>Prüfung</Button>
                    </div>
                    <Check onToggle={() => { setImageMode(!imageMode); }}>Knochen in Bild finden</Check>
                    <Check onToggle={() => { setTextMode(!textMode); }}>Knochen benennen</Check>
                </div>
                {!imageMode && !textMode ?
                    <div style={{ marginTop: "8px" }}>
                        <Alert>Du musst mindestens eine Option wählen!</Alert>
                    </div>
                    : undefined}
                <Button style={{ marginTop: "16px" }} size="large" onClick={() => {
                    if (!imageMode && !textMode) return;
                    if (!category) return;
                    let path = (mode === ExamMode.Regular ? "/exam/regular" : "/exam/real") + "/" + category + "/"
                        + (textMode ? "yes" : "no") + "txt" + "/"
                        + (imageMode ? "yes" : "no") + "img";
                    setLocation(path);
                }}>Jetzt abfragen</Button>
            </Card>
        </div>
    );
}

export default Dashboard;