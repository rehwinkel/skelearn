import "./Dashboard.scss";
import Card from "../components/Card";
import Select from "../components/Select";
import IconButton from "../components/IconButton";
import { mdiPencil } from "@mdi/js";

function Dashboard() {
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
            </Card>
        </div>
    );
}

export default Dashboard;