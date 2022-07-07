import "./Impressum.scss";
import Card from "../components/Card";
import React from "react";

function Impressum() {
    return (
        <Card style={{ width: "80%" }}>
            <div>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Impressum</span>
                </div>
                <span className="impres-section-title">Disclaimer</span>
                Diese Webseite ist ausschließlich für Fortbildungszwecke zu verwenden. Eine Veröffentlichung der hier zur Verfügung gestellten Informationen ist nicht gestattet, und nicht zu empfehlen.
                Die Inhalte unserer Webseiten wurden sorgfältig und nach bestem Gewissen erstellt und durch die besten Programmierer/innen und Grafikdesigner/innen realisiert. Gleichwohl kann für die Aktualität, Vollständigkeit und Richtigkeit sämtlicher Seiten keine Gewähr übernommen werden.
                Ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung erfolgt eine umgehende Entfernung dieser Inhalte durch uns. Eine diesbezügliche Haftung kann erst ab dem Zeitpunkt der Kenntniserlangung übernommen werden. Bei Rechtlichen Problemen wenden Sie sich an die dafür zuständige Mail: KrasseLernApp@noreply.de

                <span className="impres-section-title">Angaben gem&auml;&szlig; &sect; 5 TMG</span>
                <p>Skelearn Big Boner<br />
                    Lernapp f&uuml;r das Skelett<br />
                    Bonerstra&szlig;e 69<br />
                    76149 Karlsruhe</p>

                <span className="impres-section-title">Kontakt</span>
                <p>Telefon: +49 (0) 666 69 69 69<br />
                    Telefax: +49 (0) 420 69 31 31<br />
                    E-Mail: noreply@skelea.rn</p>

                <span className="impres-section-title">Umsatzsteuer-ID</span>
                <p>Umsatzsteuer-Identifikationsnummer gem&auml;&szlig; &sect; 27 a Umsatzsteuergesetz:<br />
                    DE999999999</p>

                <span className="impres-section-title">EU-Streitschlichtung</span>
                <p>Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.<br /> Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>

                <span className="impres-section-title">Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle</span>
                <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </div>
        </Card>
    );
}

export default Impressum;