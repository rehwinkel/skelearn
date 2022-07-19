import { ForwardedRef, forwardRef, MouseEvent, RefObject, useEffect, useRef, useState } from "react";
import "./ZoomImage.scss";
import colorAlpha from "color-alpha";
import IconButton from "./IconButton";
import { mdiArrowCollapse } from "@mdi/js";
import React from "react";

function getImageDimensions(src: any): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            reject("Invalid image src: " + src);
        };
    });
}

interface Marker {
    centerX: number,
    centerY: number,
    radius: number,
    markerWidth: number,
    markerColor: any,
    clickable: boolean,
    onClick: ((e: MouseEvent<HTMLDivElement>) => void) | null,
}

interface HoverMarker extends Marker {
    hovered: boolean,
}

const ZoomImage = forwardRef(({ src, position, pMarkers }: { src: any, pMarkers?: Array<Marker>, position?: { x: number, y: number, size: number } }, ref: ForwardedRef<HTMLDivElement>) => {
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
    let [recenter, setRecenter] = useState(0);

    let [markers, setMarkers] = useState<Array<HoverMarker>>(pMarkers ? pMarkers.map(m => {
        let nm: HoverMarker = { hovered: false, ...m };
        return nm;
    }) : []);

    function handleResize(imgWidth?: number, imgHeight?: number) {
        setContainerWidth(container.current?.offsetWidth!);
        setContainerHeight(container.current?.offsetHeight!);
        let oldImageAspect = imageHeight ? imageWidth / imageHeight : 0;
        let imgAspect = imgHeight ? (imgWidth || 0) / imgHeight : oldImageAspect;
        let aspect = container.current?.offsetHeight! / container.current?.offsetWidth!;
        if (imgAspect > 1) {
            setScale(1);
        } else {
            setScale(imgAspect * aspect);
        }
    }

    const ro = new ResizeObserver(() => {
        handleResize();
    });

    useEffect(() => {
        if (position) {
            let new_user_scale;
            if (imageWidth < imageHeight) {
                new_user_scale = imageHeight / (2 * position.size);
            } else {
                new_user_scale = imageWidth / (2 * position.size);
            }
            setUserScale(new_user_scale);
            let scaled_img_width = (new_user_scale * scale * containerWidth);
            let scaled_img_height = imageHeight / imageWidth * scaled_img_width;
            setXOffset(containerWidth / 2 - (position.x / imageWidth * scaled_img_width));
            setYOffset(containerHeight / 2 - (position.y / imageHeight * scaled_img_height));
        } else {
            let scaled_img_width = (userScale * scale * containerWidth);
            if (imageWidth < imageHeight) {
                setXOffset(containerWidth / 2 - scaled_img_width / 2);
                setYOffset(0);
            } else {
                let scaled_img_height = imageHeight / imageWidth * scaled_img_width;
                setXOffset(0);
                setYOffset(containerHeight / 2 - scaled_img_height / 2);
            }
        }
    }, [setYOffset, setXOffset, setUserScale, position, containerWidth, containerHeight, imageHeight, imageWidth, scale, recenter]);

    useEffect(() => {
        const imgDims = async () => {
            let { width, height } = await getImageDimensions(src);
            setImageWidth(width);
            setImageHeight(height);
            handleResize(width, height);
        };
        imgDims();
    }, [src, setImageWidth, setImageHeight, getImageDimensions]);

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

        let newUserScale;
        let newOffsetX = xOffset;
        let newOffsetY = yOffset;
        if (userScale - scaledScroll < 1) {
            setUserScale(1);
            newUserScale = 1;
        } else {
            setXOffset(xOffset + deltaOffsetX);
            setYOffset(yOffset + deltaOffsetY);
            setUserScale(userScale - scaledScroll);
            newOffsetX = xOffset + deltaOffsetX;
            newOffsetY = yOffset + deltaOffsetY;
            newUserScale = userScale - scaledScroll;
        }

        imgWidth = newUserScale * scale * containerWidth;
        imgHeight = (imgWidth / imageWidth) * imageHeight;
        let topEdge = -newOffsetY;
        let bottomEdge = imgHeight + newOffsetY - containerHeight;
        let leftEdge = -newOffsetX;
        let rightEdge = imgWidth + newOffsetX - containerWidth;
        if (imgHeight > imgWidth) {
            if (topEdge < 0) {
                setYOffset(0);
            }
            if (bottomEdge < 0) {
                setYOffset(newOffsetY - bottomEdge);
            }
        } else {
            if (leftEdge < 0) {
                setXOffset(0);
            }
            if (rightEdge < 0) {
                setXOffset(newOffsetX - rightEdge);
            }
        }
    }

    const inImage = (v: number) => imageWidth ? (userScale * scale * containerWidth) * v / imageWidth : undefined;

    return (
        <div ref={ref} className="zoom-image-border">
            <div ref={container} className="zoom-image-container" style={{ cursor: dragging ? "grabbing" : "grab" }} onMouseMove={drag} onMouseDown={() => { setDragging(true); }} onMouseUp={() => { setDragging(false); }} onMouseLeave={() => { setDragging(false); }} >
                <img style={{ width: userScale * scale * containerWidth, top: yOffset + "px", left: xOffset + "px" }} src={src} alt="Skelett"></img>
                {
                    markers.map(marker => {
                        if (imageWidth) {
                            let markerWidth = marker.markerWidth * userScale;
                            let markerDiameter = marker.radius * 2;
                            let markerSize = (userScale * scale * containerWidth) * markerDiameter / imageWidth;
                            let markerPosX = (xOffset || 0) + (inImage(marker.centerX - marker.radius) || 0) - markerWidth;
                            let markerPosY = (yOffset || 0) + (inImage(marker.centerY - marker.radius) || 0) - markerWidth;
                            return (<div className="marker"
                                key={marker.centerX + "_" + marker.centerY}
                                onClick={e => {
                                    if (!marker.clickable) return;
                                    marker.onClick!(e);
                                }}
                                onMouseEnter={() => {
                                    if (!marker.clickable) return;
                                    setMarkers(markers.map(
                                        m => {
                                            if (m.centerX === marker.centerX && m.centerY === marker.centerY) {
                                                m.hovered = true;
                                            }
                                            return m;
                                        }
                                    ));
                                }}
                                onMouseLeave={() => {
                                    if (!marker.clickable) return;
                                    setMarkers(markers.map(
                                        m => {
                                            if (m.centerX === marker.centerX && m.centerY === marker.centerY) {
                                                m.hovered = false;
                                            }
                                            return m;
                                        }
                                    ));
                                }}
                                style={{
                                    background: "radial-gradient(circle, " + marker.markerColor + " 0%, " + colorAlpha(marker.markerColor, marker.hovered ? 0.4 : 0.2) + " 20%, " + colorAlpha(marker.markerColor, marker.hovered ? 0.4 : 0.2) + " 100%)",
                                    left: markerPosX,
                                    top: markerPosY,
                                    width: markerSize,
                                    height: markerSize,
                                    borderWidth: markerWidth,
                                    borderColor: marker.markerColor
                                }}></div>);
                        } else {
                            return null;
                        }
                    })
                }
                <div style={{ position: "absolute", right: "8px", top: "8px", zIndex: 20 }}>
                    <IconButton icon={mdiArrowCollapse} onClick={() => { setUserScale(1); setRecenter(recenter + 1); }}></IconButton>
                </div>
            </div>
        </div>
    );
});

export default ZoomImage;