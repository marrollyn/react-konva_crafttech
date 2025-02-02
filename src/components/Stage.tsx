import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Stage, Layer, Rect, Circle, RegularPolygon, Line, Transformer } from 'react-konva';
import Konva from 'konva';
import { v4 as uuidv4 } from "uuid";
import { TRectangle, TCircle, TTriangle, TStageCompProps } from '../types';

const StageComp: React.FC<TStageCompProps> = ({ setShape, shape }) => {

    const initRect = { id: uuidv4(), x: 50, y: 50, width: 100, height: 100, fill: 'yellow' }
    const initCircle = { id: uuidv4(), x: 100, y: initRect.y + initRect.height + 70, radius: 50, fill: "#89b717" }
    const initTriangle = { 
        id: uuidv4(), 
        points: [
            100, initCircle.y + initCircle.radius + 20, 
            50, initCircle.y + initCircle.radius + 100, 
            150, initCircle.y + initCircle.radius + 100], 
            fill: 'green' 
        }

    const stageRef = useRef<Konva.Stage | null>(null);
    const transformerRef = useRef<Konva.Transformer | null>(null);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    const [triangles, setTriangles] = useState<TTriangle[]>([initTriangle]);
    const [rectangles, setRectangles] = useState<TRectangle[]>([initRect]);
    const [circles, setCircles] = useState<TCircle[]>([initCircle]);

    const [selectedShapeId, setSelectedShapeId] = useState<null | string>(null);

    

    useEffect(()=>{
        if (shape === 'clear') {
            setCircles([]);
            setRectangles([]);
            setTriangles([]);
            setSelectedShapeId(null);
        }
    }, [shape])

    useEffect(() => {
        const transformer = transformerRef.current;
        if (!transformer || !stageRef.current) return;
        if (transformer) {
            const selectedNode = stageRef.current?.findOne(`#${selectedShapeId}`);
            transformer.nodes(selectedNode ? [selectedNode] : []);
            transformer.getLayer()?.batchDraw();
        } 
    }, [selectedShapeId]);

    const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = stageRef.current;
        if (!stage) return;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        const clickedShape = stage.getIntersection(pos);

        if (clickedShape) {
            setShape('')
            return; 
        }

        if (!shape && e.evt.button === 0) {
            setIsDragging(true);
            setDragStartPos({ x: e.evt.clientX, y: e.evt.clientY });
        } else if (shape) addShape(e);

    }, [shape]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove =  useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDragging) return;
        const x = e.evt.clientX - dragStartPos.x;
        const y = e.evt.clientY - dragStartPos.y;
        setPosition((prev) => ({
            x: prev.x + x / scale,
            y: prev.y + y / scale,
        }));
        setDragStartPos({ x: e.evt.clientX, y: e.evt.clientY });
    }, [isDragging, dragStartPos, scale]);

    const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const newScale = e.evt.deltaY > 0 ? scale * 1.1 : scale * 0.9;
        setScale(newScale);
    }, [scale]);

    const addShape = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = stageRef.current;
        if (!stage) return;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        const newShape = {
            id: uuidv4(),
            x: pos.x,
            y: pos.y,
        };

        if (shape === 'circle') {
            const newCircle = { ...newShape, radius: 50 };
            setCircles((prevCircles) => [...prevCircles, newCircle]);
        }
        if (shape === 'rectangle') {
            const newRectangle = { ...newShape, width: 100, height: 100 };
            setRectangles((prevRectangles) => [...prevRectangles, newRectangle]);
        }
        if (shape === 'triangle') {
            const newTriangle = {
                id: uuidv4(),
                points: [
                    pos.x, pos.y,
                    pos.x + 60, pos.y + 100,
                    pos.x - 60, pos.y + 100,
                ],
            };
            setTriangles((prevTriangles) => [...prevTriangles, newTriangle]);
        }
    }, [shape]);

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
                    {circles.map((circle) => (
                        <Circle 
                            id={circle.id}
                            draggable 
                            key={circle.id} 
                            x={circle.x} 
                            y={circle.y} 
                            radius={circle.radius} 
                            stroke="black" 
                            fill={circle.fill}
                            onClick={() => setSelectedShapeId(circle.id)}
                        />
                    ))}
                    {rectangles.map((rectangle) => (
                        <Rect 
                            draggable 
                            id={rectangle.id}
                            key={rectangle.id} 
                            x={rectangle.x} 
                            y={rectangle.y} 
                            width={rectangle.width} 
                            height={rectangle.height} 
                            stroke="black" 
                            fill={rectangle.fill}
                            onClick={() => setSelectedShapeId(rectangle.id)}
                        />
                    ))}
                    {triangles.map((triangle) => (
                    <Line
                        id={triangle.id}
                        key={triangle.id}
                        points={triangle.points}
                        stroke="black"
                        strokeWidth={2}
                        fill={triangle.fill}
                        closed 
                        draggable
                        onClick={() => setSelectedShapeId(triangle.id)}
                    />
                ))}
                <Transformer ref={transformerRef} />
                </Layer>
            </Stage>
        </>
    );
};

export default StageComp;