// script.js
console.log("script.js loaded");

function Run() {
    // Make sure function is executed
    console.log("Run function started");

    // Make sure theJSON exists and is visible
    console.log("theJSON from data.js:", theJSON);

    // create array from bounding box data
    var bboxArray = theJSON.data;

    // print it out to the console
    console.log("bboxArray:", bboxArray);

    // Pring out email message
    console.log("Bounding box computed for tdickinsam41@tamu.edu");

    // Find the corners
    var corners = getBoundingBoxCorners(bboxArray);
    console.log("Bounding box corners:", corners);

}

function getBoundingBoxCorners(points) {
// Find points for actual bounding box
// Identify which input point is closest to ideal point
// remove point from comparison once it's been used

    // Start with initial point as value
    var minLat = points[0].lat;
    var maxLat = points[0].lat;
    var minLon = points[0].lon;
    var maxLon = points[0].lon;

    // Find overall min/max lat/lon
    for (var i = 1; i < points.length; i++) {
        var p = points[i];
        if (p.lat < minLat) 
            minLat = p.lat;
        if (p.lat > maxLat) 
            maxLat = p.lat;
        if (p.lon < minLon) 
            minLon = p.lon;
        if (p.lon > maxLon) 
            maxLon = p.lon;
    }

    // 2) Define the "ideal" rectangle corners
    var idealCorners = [
        { name: "topLeft",     lat: maxLat, lon: minLon },
        { name: "topRight",    lat: maxLat, lon: maxLon },
        { name: "bottomRight", lat: minLat, lon: maxLon },
        { name: "bottomLeft",  lat: minLat, lon: minLon }
    ];

    // 3) Work on a copy so we can remove used points
    var unused = points.slice(); // shallow copy
    var result = {};

    // 4) For each ideal corner, pick the closest unused point
    idealCorners.forEach(function (corner) {
        // initialize variables
        var bestIndex = 0;
        var bestDistSq = Infinity;

        for (var i = 0; i < unused.length; i++) {
            var p = unused[i];
            var dLat = p.lat - corner.lat;
            var dLon = p.lon - corner.lon;

            // calculate squared distance
            var distSq = dLat * dLat + dLon * dLon; 

            // update if closer
            if (distSq < bestDistSq) {
                bestDistSq = distSq;
                bestIndex = i;
            }
        }

        // Remove the chosen point from "unused" so it can't be reused
        var chosen = unused.splice(bestIndex, 1)[0];
        result[corner.name] = chosen;
    });

    return result; 
}
