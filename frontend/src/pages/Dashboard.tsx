import "./Dashboard.scss";
import Card from "../components/Card";
import Select from "../components/Select";
import IconButton from "../components/IconButton";
import { mdiPencil } from "@mdi/js";
import Button from "../components/Button";
import { useState } from "react";
import Check from "../components/Check";

enum TestMode {
    SpacedRep,
    Timed,
    Test,
}

function Dashboard() {
    let [mode, setMode] = useState<TestMode>(TestMode.SpacedRep);

    return (
        <div className="dashboard-container">
            <Card loading={false}>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Lernfortschritt</span>
                </div>
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
                <Button size="large" onClick={() => { }}>Jetzt loslernen</Button>
                <span className="dashboard-section-title">Abfragemodus</span>
                <div className="dashboard-test-settings">
                    <div className="dashboard-mode-buttons">
                        <Button color="accent" inverted={mode !== TestMode.SpacedRep} onClick={() => { setMode(TestMode.SpacedRep) }}>Spaced-Rep.</Button>
                        <Button color="accent" inverted={mode !== TestMode.Timed} onClick={() => { setMode(TestMode.Timed) }}>Timer</Button>
                        <Button color="accent" inverted={mode !== TestMode.Test} onClick={() => { setMode(TestMode.Test) }}>Prüfung</Button>
                    </div>
                    <Check onToggle={() => { }}>Knochen benennen</Check>
                    <Check onToggle={() => { }}>Knochen identifizieren</Check>
                </div>
                <Button style={{ marginTop: "16px" }} size="large" onClick={() => { }}>Jetzt abfragen</Button>
            </Card>
        </div>
    );
}

export default Dashboard;