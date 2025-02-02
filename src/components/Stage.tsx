import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';

type StageCompProps = {
    shape: string; 
}

type Shape = {
    id: string;
    color: string;
    x?: number;
    y?: number;
};

type Rectangle = Shape & {
    width: number;
    height: number;
    x: number;
    y: number;
};

type Circle = Shape & {
    radius: number;
    x: number;
    y: number;
};

const StageComp: React.FC<StageCompProps> = ({ shape }) => {

    const stageRef = useRef<Konva.Stage | null>(null);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    const currentShape = shape;

    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [circles, setCircles] = useState<Circle[]>([]);

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.evt.button === 0) {
            setIsDragging(true);
            setDragStartPos({ x: e.evt.clientX, y: e.evt.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDragging) return;
        const x = e.evt.clientX - dragStartPos.x;
        const y = e.evt.clientY - dragStartPos.y;
        setPosition((prev) => ({
            x: prev.x + x / scale,
            y: prev.y + y / scale,
        }));
        setDragStartPos({ x: e.evt.clientX, y: e.evt.clientY });
    };

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const newScale = e.evt.deltaY > 0 ? scale * 1.1 : scale * 0.9;
        setScale(newScale);
    };

    return (
        <>
            <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            draggable={false}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            x={position.x}
            y={position.y}
            scaleX={scale}
            scaleY={scale}
        >
            <Layer>
                <Rect x={50} y={50} width={100} height={100} fill="red" />
                <Circle x={200} y={200} radius={50} fill="green" />
            </Layer>
        </Stage>
        </>
    );
};

export default StageComp;