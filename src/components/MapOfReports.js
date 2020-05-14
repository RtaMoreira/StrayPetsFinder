import React, {useState, useEffect } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { MarkerLostPet, MarkerFoundPet } from "./Markers";
import DialogDetail from "./DialogDetail";


const MapOfReports = (props) => {
  const [map, setMap] = useState(props.centerMap);
  const zoom = 12;
  const [dialog, setDialog] = useState({ open: false, selectedPost: null });

  useEffect(() => {
    setMap(props.centerMap);
  }, [props.centerMap]);

  //for Dialog box containing report details
  const handleClickOpen = (key) => {
    setDialog({ open: true, selectedPost: key });
  };

  const handleClose = (key) => {
    setDialog({ open: true, selectedPost: key });
  };


  return (
    <Map
      center={[map.lat, map.lng]}
      zoom={zoom}
      style={{ width: "100%", height: "85vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" //s = one of the available subdomains, Z = zoom, x-y = coordonates
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {
        //loop into each report and show marker
        props.reports.map((report, key) => {
          const point = [report.lat, report.lng];

          return (
            <div key={key}>
              <Marker
                position={point}
                key={key}
                icon={
                  report.status === "found" ? MarkerFoundPet : MarkerLostPet
                }
                onMouseOver={(e) => {
                  e.target.openPopup();
                }}
                onMouseOut={(e) => {
                  e.target.closePopup();
                }}
                onmousedown={() => handleClickOpen(key)}
              >
                <Popup>
                  <span>
                    {report.status.toUpperCase()} {report.animal.toUpperCase()}(
                    {report.date.toLocaleDateString()}) by{" "}
                    {report.firstname} {report.lastname.substring(0, 1)}.
                  </span>
                  <br />
                  <img
                    src={report.imageUrl}
                    width="200"
                    height="auto"
                    alt="pet"
                  />
                  <br />
                </Popup>
              </Marker>
              {dialog.selectedPost === key //Show dialog when it's selected
                ? < DialogDetail report={report} handleClose={handleClose} dialog={dialog} />
                : null}
            </div>
          );
        })
      }
    </Map>
  );
};

export default MapOfReports;
