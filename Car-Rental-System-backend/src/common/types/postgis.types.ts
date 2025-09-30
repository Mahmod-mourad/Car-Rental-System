// Type definitions for PostGIS geometry types
export type Point = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
};

// Helper function to create a Point geometry
export function createPoint(longitude: number, latitude: number): Point {
  return {
    type: 'Point',
    coordinates: [longitude, latitude],
    crs: {
      type: 'name',
      properties: {
        name: 'EPSG:4326', // WGS 84
      },
    },
  };
}

// Helper function to extract coordinates from a Point
export function getCoordinates(point: Point): [number, number] {
  return point.coordinates;
}
