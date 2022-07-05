import { mdiArrowCollapse } from "@mdi/js";
import { useReducer, useState } from "react";
import Card from "../components/Card";
import IconButton from "../components/IconButton";
import ZoomImage from "../components/ZoomImage";
import accurateSkel from "../accurate-skeleton.png";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    description: string,
    img: any,
}

function Question({ currentStructure }: { currentStructure?: AnatomicStructure }) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    // TODO: let user click a place and check that, also let user name the structure

    return (
        <div className="learn-container">
            <div style={{ height: "max(300px, calc(100vh - 370px))" }}>
                <ZoomImage
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
                        <span className="learn-title">{currentStructure?.title || "Loading..."}</span>
                        <p className="learn-text" >
                            {currentStructure?.description || "Loading..."}
                        </p>
                    </div>
                    <IconButton icon={mdiArrowCollapse} onClick={() => { forceUpdate(); }}></IconButton>
                </div>
                <div className="learn-button-spacer"></div>
                <div className="learn-buttons">
                    nice cock
                </div>
            </div>
        </div>
    );
}

function Correct() {
    return (
        <div>
            Das ist sau richtig Bro!
        </div>
    );
}

function Wrong() {
    return (
        <div>
            Du dummer Bastard!
        </div>
    );
}

function SpacedRepExam({ textMode, imageMode }: { textMode: boolean, imageMode: boolean }) {
    let [structures, setStructures] = useState<Array<AnatomicStructure>>([{
        centerX: 0,
        centerY: 0,
        radius: 100,
        title: "Flex",
        description: "Ein Flex auf dich!",
        img: accurateSkel
    }]);
    let [currentIndex, setCurrentIndex] = useState<number>(0);
    let currentStructure: AnatomicStructure = structures.length > 0 ? structures[currentIndex] : null!;

    let [questioning, setQuestioning] = useState(true);
    let [correct, setCorrect] = useState(false);

    return (
        <Card style={{ width: "80%" }} loading={structures.length === 0}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Spaced-Repetition</span>
            </div>
            {
                questioning ? <Question currentStructure={currentStructure} /> : (
                    correct ? <Correct /> : <Wrong />
                )
            }

        </Card>
    );
}

export default SpacedRepExam;