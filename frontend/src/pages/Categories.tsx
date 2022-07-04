import "./Categories.scss";
import Card from "../components/Card";
import { Link } from "wouter";
import { useState } from "react";
import Button from "../components/Button";

function Categories() {
    return (
        <div className="categories-container">
            <Card loading={false}>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Kategorien bearbeiten</span>
                </div>
                <div>
                    <span>Hallo hier kannst du Kategorien also Ordner erstellen und alle Knochen reinpacken die du lernen willst!!</span>
                </div>
                <span className="categories-section-title">Kategorien</span>
                <Link to="/learn">
                    <Button size="large" onClick={() => { }}>Jetzt loslernen</Button>
                </Link>
            </Card>
        </div>
    );
}

export default Categories;