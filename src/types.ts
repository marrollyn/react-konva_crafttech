export type TShape = {
    id: string;
    x: number;
    y: number;
    fill?: string;
};

export type TRectangle = TShape & {
    width: number;
    height: number;
};

export type TCircle = TShape & {
    radius: number;
};

export type TTriangle = {
    id: string;
    fill?: string;
    points: number[];
}

export type TStageCompProps = {
    setShape: (shape: string) => void;
    shape: string;
}