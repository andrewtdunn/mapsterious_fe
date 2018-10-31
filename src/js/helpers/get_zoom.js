var ZOOM_METERS_ADJUSTMENT = 3000
var NORMAL_ZOOM_DISTANCE = 16
var FARTHEST_ZOOM_OUT = 5
/**
 * calculates distance between points
 * and returns zoom level
 */
function getZoom (pointA, pointB) {
  var distance = getDistance(pointA, pointB)
  var adjustment = Math.floor(distance / ZOOM_METERS_ADJUSTMENT)
  if (adjustment < 0) { adjustment = 0 }
  var newZoom = NORMAL_ZOOM_DISTANCE - adjustment
  if (newZoom < FARTHEST_ZOOM_OUT) { newZoom = FARTHEST_ZOOM_OUT }
  return newZoom
}

var rad = function (x) {
  return x * Math.PI / 180
}

var getDistance = function (p1, p2) {
  var R = 6378137 // Earth’s mean radius in meters
  var dLat = rad(p2.lat - p1.lat)
  var dLong = rad(p2.lng - p1.lng)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2)
  var sqrA = Math.sqrt(a)
  var sqrB = Math.sqrt(1 - a)
  var c = 2 * Math.atan2(sqrA, sqrB)
  var d = R * c
  return d // returns the distance in meter
}

export default getZoom
