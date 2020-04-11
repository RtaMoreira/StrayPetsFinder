import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import { storage } from "../firebaseConfig";


//const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//const GeocodingService = mbxGeocoding({ accessToken: "pk.eyJ1Ijoicml0aW5oYWEiLCJhIjoiY2s4ZWowODJpMTc3aDNlb2FnaG9yNWN0ZyJ9.lZtR-HRowYX79xF_RJC-Sg"});


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

export default class MapOfReports extends Component {
  state = {
    lat: 60.199999,
    lng: 24.93777,
    zoom: 12,
    open: false,
    selectedPost: null,
    location : null
  };

  handleClickOpen = key => {
    this.setState({ open: true, selectedPost: key });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  getImage = async (path) => {
    console.log(path);
    const ref = storage.ref(path);
    const url = await ref.getDownloadURL();
    return url;
  }

  dialogDetail = report => {
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.state.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          {report.status.toUpperCase()+" "+report.animal.toUpperCase()+" ("+
          report.date.toDate().toLocaleDateString()+") by "+ report.firstname+" "+report.lastname.substring(0,1)+"."}
        </DialogTitle>
        <DialogContent dividers>

        <img
              src={report.imageUrl}
              width= "100%"
              height="auto"
              alt="pet"
          /><br />

          Name: {report.petName? report.petName: "?"}<br/>
          Age:  {report.petAge ? report.petAge + " years old" : "?"}<br/>
          Gender: {report.petGender? report.petGender: "?"} <br />
          Breed: {report.petBreed? report.petBreed: "?"}<br />
          Coat type: {report.petCoatType? report.petCoatType+" hair" : "?"} <br />
          Coat color(s): {report.petCoatColor? report.petCoatColor.toString(): "?"}<br />
          Eyes color: {report.petEyesColor? report.petEyesColor: "?"}<br />
          Pet size: {report.petSize? report.petSize: "?" }<br />
          Particular information: {report.petParticularInfo? report.petParticularInfo: "-"} <br />
          Circonstances: {report.circonstances? report.circonstances: "-"}<br />
          Location : {report.location}
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            autoFocus
            onClick={this.handleClose}
            color="primary"
            variant="contained"
            disabled
          >
            {report.status === "found"
              ? "Contact"
              : "Contact"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };


  render() {
    return this.props.reports ? (
      <Map
        center={[this.state.lat, this.state.lng]}
        zoom={this.state.zoom}
        style={{ width: "100%", height: "85vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {this.props.reports.map((report, key) => {
          const point = [report.lat, report.lng];

          return (
            <div key={key}>
              <Marker
                position={point}
                key={key}
                icon={
                  report.status === "found" ? MarkerFoundPet : MarkerLostPet
                }
                onMouseOver={e => {
                  e.target.openPopup();
                }}
                onMouseOut={e => {
                  e.target.closePopup();
                }}
                onmousedown={() => this.handleClickOpen(key)}
              >
                <Popup>
                  <span>
                    {report.status.toUpperCase()} {report.animal.toUpperCase()}{" "}
                    ({report.date.toDate().toLocaleDateString()+") by "+report.firstname+" "+report.lastname.substring(0,1)+"."}
                  </span>
                  <br />
                  <img
              src={report.imageUrl}
              width= "200"
              height="auto"
              alt="pet"
          /><br />
                </Popup>
              </Marker>
              {this.state.selectedPost === key
                ? this.dialogDetail(report)
                : null}
            </div>
          );
        })}
      </Map>
    ) : (
      "Data is loading..."
    );
  }
}
