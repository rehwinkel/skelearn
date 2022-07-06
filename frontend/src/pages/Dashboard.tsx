import "./Dashboard.scss";
import Card from "../components/Card";
import Select from "../components/Select";
import IconButton from "../components/IconButton";
import { mdiPencil } from "@mdi/js";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import Check from "../components/Check";
import ProgressBar from "../components/ProgressBar";
import { Link, useLocation } from "wouter";
import Alert from "../components/Alert";
import { apiGetCategories } from "../api";

enum ExamMode {
    Regular,
    Real,
}

interface Category {
    name: string,
    elements: Array<string>,
}

function Dashboard() {
    let [_, setLocation] = useLocation();
    let [mode, setMode] = useState<ExamMode>(ExamMode.Regular);
    let [imageMode, setImageMode] = useState<boolean>(false);
    let [textMode, setTextMode] = useState<boolean>(false);
    let [category, setCategory] = useState("");

    let [categories, setCategories] = useState<Array<Category>>([]);

    useEffect(() => {
        let getInfo = async () => {
            setCategories(await apiGetCategories());
        };
        getInfo();
    }, [setCategories]);

    return (
        <div className="dashboard-container">
            <Card loading={false}>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Lernfortschritt</span>
                </div>
                <span className="dashboard-section-title">Spaced-Rep. (90%)</span>
                <ProgressBar progress={0.9}></ProgressBar>
                <span className="dashboard-section-title">Timer (5%)</span>
                <ProgressBar progress={0.05}></ProgressBar>
                <span className="dashboard-section-title">Prüfung (51%)</span>
                <ProgressBar progress={0.51}></ProgressBar>
            </Card>
            <Card loading={false}>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Lernen</span>
                </div>
                <span className="dashboard-section-title">Kategorien</span>
                <div className="dashboard-categories">
                    <Select options={categories.map(c => { return { key: c.name, name: c.name + " (" + c.elements.length + ")" }; })} onSelected={(e) => { setCategory(e.target.value); }}></Select>
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