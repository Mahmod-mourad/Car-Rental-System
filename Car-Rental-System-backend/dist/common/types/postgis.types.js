"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoint = createPoint;
exports.getCoordinates = getCoordinates;
function createPoint(longitude, latitude) {
    return {
        type: 'Point',
        coordinates: [longitude, latitude],
        crs: {
            type: 'name',
            properties: {
                name: 'EPSG:4326',
            },
        },
    };
}
function getCoordinates(point) {
    return point.coordinates;
}
//# sourceMappingURL=postgis.types.js.map