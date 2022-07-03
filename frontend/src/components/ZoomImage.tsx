import { MouseEvent, RefObject, useEffect, useRef, useState } from "react";
import "./ZoomImage.scss";

function getImageDimensions(src: any): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            reject("Invalid image src");
        };
    });
}

function ZoomImage({ src }: { src: any }) {
    let container: RefObject<HTMLDivElement> = useRef(null);
    let [containerWidth, setContainerWidth] = useState(0);
    let [containerHeight, setContainerHeight] = useState(0);
    let [xOffset, setXOffset] = useState(0);
    let [yOffset, setYOffset] = useState(0);
    let [scale, setScale] = useState(1);
    let [userScale, setUserScale] = useState(1);
    let [imageWidth, setImageWidth] = useState(0);
    let [imageHeight, setImageHeight] = useState(0);
    let [dragging, setDragging] = useState(false);

    function handleResize(imgWidth?: number, imgHeight?: number) {
        setContainerWidth(container.current?.offsetWidth!);
        setContainerHeight(container.current?.offsetHeight!);
        let oldImageAspect = imageHeight ? imageWidth / imageHeight : 0;
        let imgAspect = imgHeight ? (imgWidth || 0) / imgHeight : oldImageAspect;
        let aspect = container.current?.offsetHeight! / container.current?.offsetWidth!;
        setScale(imgAspect * aspect);
    }

    const ro = new ResizeObserver(() => {
        handleResize();
    });

    useEffect(() => {
        setXOffset(containerWidth / 2 - (userScale * scale * containerWidth) / 2);
    }, [setXOffset, containerWidth]);

    useEffect(() => {
        const imgDims = async () => {
            let { width, height } = await getImageDimensions(src);
            setImageWidth(width);
            setImageHeight(height);
            handleResize(width, height);
        };
        imgDims();
    }, [setImageWidth, setImageHeight, getImageDimensions]);

    useEffect(() => {
        const toObserve = container.current!;
        toObserve.addEventListener("wheel", zoom, { passive: false });
        ro.observe(toObserve);
        return () => {
            toObserve.removeEventListener("wheel", zoom);
            ro.unobserve(toObserve);
        };
    }, [container, zoom, getImageDimensions, setImageHeight, setImageWidth, handleResize]);

    function drag(e: MouseEvent) {
        if (dragging) {
            setXOffset(xOffset + e.movementX);
            setYOffset(yOffset + e.movementY);
        }
    }

    function zoom(e: any) {
        e.preventDefault();
        let scroll = (e.deltaX + e.deltaY) / 1000.0;
        let scaledScroll = userScale * scroll;

        let imgWidth = userScale * scale * containerWidth;
        let imgHeight = (imgWidth / imageWidth) * imageHeight;
        let newImgWidth = (userScale - scaledScroll) * scale * containerWidth;
        let newImgHeight = (newImgWidth / imageWidth) * imageHeight;
        let cornerOffsetX = e.layerX - xOffset;
        let cornerOffsetY = e.layerY - yOffset;
        let deltaOffsetX = cornerOffsetX / imgWidth * -(newImgWidth - imgWidth);
        let deltaOffsetY = cornerOffsetY / imgHeight * -(newImgHeight - imgHeight);
        setXOffset(xOffset + deltaOffsetX);
        setYOffset(yOffset + deltaOffsetY);

        setUserScale(userScale - scaledScroll);
    }

    return (
        <div className="zoom-image-border">
            <div ref={container} className="zoom-image-container" style={{ cursor: dragging ? "grabbing" : "grab" }} onMouseMove={drag} onMouseDown={() => { setDragging(true); }} onMouseUp={() => { setDragging(false); }} onMouseLeave={() => { setDragging(false); }} >
                <img style={{ width: userScale * scale * containerWidth, top: yOffset + "px", left: xOffset + "px" }} src={src} alt="Skelett"></img>
            </div>
        </div>
    );
}

export default ZoomImage;