export type Point = {
    type: 'Point';
    coordinates: [number, number];
    crs?: {
        type: string;
        properties: {
            name: string;
        };
    };
};
export declare function createPoint(longitude: number, latitude: number): Point;
export declare function getCoordinates(point: Point): [number, number];
