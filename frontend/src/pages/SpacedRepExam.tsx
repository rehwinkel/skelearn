import { mdiArrowCollapse } from "@mdi/js";
import { useReducer, useState, useEffect } from "react";
import colors from "../colors.module.scss";
import Card from "../components/Card";
import IconButton from "../components/IconButton";
import ZoomImage from "../components/ZoomImage";
import { apiGetAnatomy } from "../api";

interface AnatomicStructure {
    centerX: number,
    centerY: number,
    radius: number,
    title: string,
    img: any,
    key: string,
}

function QuestionImage({ structures, currentStructure, onSuccess, onFailure }: { structures: Array<AnatomicStructure>, currentStructure?: AnatomicStructure, onSuccess: () => void, onFailure: () => void }) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    let markers = structures.map(
        str => {
            return {
                centerX: str.centerX,
                centerY: str.centerY,
                radius: str.radius,
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
                        <span className="learn-title">Klicke auf den {currentStructure?.title}</span>
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

function QuestionText() {
    return <div>FUCK YOU</div>;
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

enum QuestionMode {
    Image,
    Text,
}

function SpacedRepExam({ textMode, imageMode }: { textMode: boolean, imageMode: boolean }) {
    let [structures, setStructures] = useState<Array<AnatomicStructure>>([]);
    let [currentIndex, setCurrentIndex] = useState<number>(0);
    let currentStructure: AnatomicStructure = structures.length > 0 ? structures[currentIndex] : null!;

    let [questioning, setQuestioning] = useState(true);
    let [questionMode, setQuestionMode] = useState(QuestionMode.Image);
    let [correct, setCorrect] = useState(false);

    useEffect(() => {
        const getInfo = async () => {
            let rawData = await apiGetAnatomy();
            setStructures(rawData.map(
                elem => {
                    return {
                        centerX: elem.imgPosX,
                        centerY: elem.imgPosY,
                        radius: elem.selectionRadius,
                        title: elem.name,
                        img: elem.img,
                        key: elem.name,
                    };
                }
            ));
        };
        getInfo();
    }, [setStructures]);

    return (
        <Card style={{ width: "60%" }} loading={structures.length === 0}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Spaced-Repetition</span>
            </div>
            {
                questioning ? (
                    questionMode === QuestionMode.Image ?
                        <QuestionImage structures={structures}
                            currentStructure={currentStructure}
                            onSuccess={() => {
                                setQuestioning(false);
                                setCorrect(true);
                            }}
                            onFailure={() => {
                                setQuestioning(false);
                                setCorrect(false);
                            }} /> :
                        <QuestionText />
                ) : (
                    correct ? <Correct /> : <Wrong />
                )
            }

        </Card>
    );
}

export default SpacedRepExam;