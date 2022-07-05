import "./Dashboard.scss";
import Card from "../components/Card";
import Select from "../components/Select";
import IconButton from "../components/IconButton";
import { mdiPencil } from "@mdi/js";
import Button from "../components/Button";
import { useState } from "react";
import Check from "../components/Check";
import ProgressBar from "../components/ProgressBar";
import { Link, useLocation } from "wouter";

enum ExamMode {
    Regular,
    Real,
}

function Dashboard() {
    let [_, setLocation] = useLocation();
    let [mode, setMode] = useState<ExamMode>(ExamMode.Regular);
    let [imageMode, setImageMode] = useState<boolean>(false);
    let [textMode, setTextMode] = useState<boolean>(false);

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
                    <Select options={["test", "yeag", "nice"]} onSelected={(e) => { console.log(e) }}></Select>
                    <IconButton icon={mdiPencil} onClick={() => { }}></IconButton>
                </div>
                <span className="dashboard-section-title">Lernmodus</span>
                <Link to="/learn">
                    <Button size="large" onClick={() => { }}>Jetzt loslernen</Button>
                </Link>
                <span className="dashboard-section-title">Abfragemodus</span>
                <div className="dashboard-test-settings">
                    <div className="dashboard-mode-buttons">
                        <Button color="accent" inverted={mode !== ExamMode.Regular} onClick={() => { setMode(ExamMode.Regular) }}>Regulär</Button>
                        <Button color="accent" inverted={mode !== ExamMode.Real} onClick={() => { setMode(ExamMode.Real) }}>Prüfung</Button>
                    </div>
                    <Check onToggle={() => { setImageMode(!imageMode); }}>Knochen benennen</Check>
                    <Check onToggle={() => { setTextMode(!textMode); }}>Knochen identifizieren</Check>
                </div>
                <Button style={{ marginTop: "16px" }} size="large" onClick={() => {
                    let path = (mode === ExamMode.Regular ? "/exam/regular" : "/exam/real") + "/"
                        + (imageMode ? "yes" : "no") + "img" + "/"
                        + (textMode ? "yes" : "no") + "txt";
                    console.log(path);
                    setLocation(path);
                }}>Jetzt abfragen</Button>
            </Card>
        </div>
    );
}

export default Dashboard;