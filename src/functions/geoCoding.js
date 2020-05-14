
//geocodeReverse : from lat,lng, return address in a callback
export const geocodeReverse = async (lat, lng, reportCallback,center) => {
  let locationString;
  fetch(
    "https://www.mapquestapi.com/geocoding/v1/reverse?key=XDt7bT6BSbau4x8QXPYR3AqtRMKf1dPR&location=" +
      lat +
      "," +
      lng +
      ""
  )
    .then((response) => response.json())
    .then((data) => {
      locationString =
        (data.results[0].locations[0].street !== ""
          ? data.results[0].locations[0].street + ", "
          : "") + data.results[0].locations[0].adminArea5;

      reportCallback(lat, lng, locationString); //return result
      center({...center,lat: lat, lng: lng});
    })
    .catch((err) => console.error(err));
};

//geocodeForward : from location return lat,lng in a callback
export const geocodeForward = async (location, reportCallback= null, pickedPosition= null,center= null) => {
  let lat;
  let lng;
  fetch(
    "https://www.mapquestapi.com/geocoding/v1/address?key=XDt7bT6BSbau4x8QXPYR3AqtRMKf1dPR&location="+
      location
  )
    .then((response) => response.json())
    .then((data) => {
        lat = data.results[0].locations[0].latLng.lat;
        lng = data.results[0].locations[0].latLng.lng;
        console.log(data.results[0].locations[0].latLng);

        if(reportCallback != null)
        reportCallback(lat,lng, location); //return result
        if(pickedPosition != null)
        pickedPosition(data.results[0].locations[0].latLng);
        if(center != null)
        center({...center,lat: lat, lng: lng});
    })
    .catch((err) => console.error(err));
};

//get location : get currentLocation from browser
export const getCurrentLocation = (callback,errorcallback=null) => {
  console.log("currentLocation");
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(callback,errorcallback);
  }
};

//Calculate distance between 2 coordinates (km)
//retrieved from https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  //console.log(lat1+":"+lon1+"---"+lat2+":"+lon2);

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  //round number
  d = Math.round(d * 10) / 10
  return d;
}

const deg2rad = (deg) =>{
  return deg * (Math.PI/180)
}
