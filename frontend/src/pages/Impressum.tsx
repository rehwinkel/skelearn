import Card from "../components/Card";

function Impressum() {
    return (
        <Card style={{ width: "80%" }}>
            <div>
                <div style={{ textAlign: "center" }}>
                    <span className="card-title">Impressum</span>
                </div>
                Disclaimer: Diese Webseite ist ausschließlich für Fortbildungszwecke zu verwenden. Eine Veröffentlichung der hier zur Verfügung gestellten Informationen ist nicht gestattet, und nicht zu empfehlen.
                Die Inhalte unserer Webseiten wurden sorgfältig und nach bestem Gewissen erstellt und durch die besten Programmierer/innen und Grafikdesigner/innen realisiert. Gleichwohl kann für die Aktualität, Vollständigkeit und Richtigkeit sämtlicher Seiten keine Gewähr übernommen werden.
                Ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung erfolgt eine umgehende Entfernung dieser Inhalte durch uns. Eine diesbezügliche Haftung kann erst ab dem Zeitpunkt der Kenntniserlangung übernommen werden. Bei Rechtlichen Problemen wenden Sie sich an die dafür zuständige Mail: KrasseLernApp@noreply.de
            </div>
        </Card>
    );
}

export default Impressum;