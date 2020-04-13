
//geocodeReverse : from lat,lng, return address in a callback
export const geocodeReverse = async (lat, lng, callback) => {
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

      callback(lat, lng, locationString); //return result
    })
    .catch((err) => console.error(err));
};

//get location : get currentLocation from browser
export const getCurrentLocation = (callback) => {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(callback);
  } else {
    console.log("error when getting the location of the navigator");
  }
};

//function that retrieves the position from browser
/*const showPosition = position => {
  var location = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  console.log("show",location);
  return location;
  //setCurrenLocation(location);

};*/
