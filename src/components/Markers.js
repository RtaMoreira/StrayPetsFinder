import L from "leaflet";

export const MarkerLostPet = L.icon({
    iconUrl: require("../assets/lostPet-filled2.svg"),
    iconSize: [40, 40],
    shadowSize: [40, 40],
    iconAnchor: [20, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 0],
    shadowUrl: require("../assets/shadow.svg")
  });
  export const MarkerFoundPet = L.icon({
    iconUrl: require("../assets/foundPet-filled2.svg"),
    iconSize: [40, 40],
    shadowSize: [40, 40],
    iconAnchor: [20, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 0],
    shadowUrl: require("../assets/shadow.svg")
  });