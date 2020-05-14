import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import {
  geocodeReverse,
  geocodeForward,
} from "../../functions/geoCoding";
import { validationNext } from "../../functions/validation";
import * as yup from "yup";
import style from "../../assets/style";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Map, TileLayer, Marker } from "react-leaflet";

const EventInfo = (props) => {
  const classes = style();
  const [center, setCenter] = useState({
    lat: 46.46299,  //Vevey, CH by default
    lng: 6.84345,
    zoom: 13,
  });
  const [pickedPosition, setPickedPosition] = useState();
  //validation form
  const [errors, setErrors] = useState({ path: "", message: "" });
  const validationSchema = yup.object().shape({
    lat: yup.number().required("A position in the map is required"),
    lng: yup.number().required("A position in the map is required"),
    location: yup.string().required("A position in the map is required"),
  });

  useEffect(() => {
    var coordinates = {lat: props.report.lat, lng:props.report.lng};
    //if location already given (by browser or because is editing an existing report) setCenter of map to it
    if (coordinates.lat !== 0)
      setCenter({ ...center, lat: coordinates.lat, lng: coordinates.lng });

    //if EDIT MODE : show picked position || if in add mode, position has been picked and go back from review
    if(props.report.id || (props.report.location!=="" && coordinates.lng!==0))
      setPickedPosition({lat: coordinates.lat, lng: coordinates.lng});
  }, [props.report]);

  const handleClickonMap = async (e) => {
    setPickedPosition(e.latlng);
    //setCenter({ ...center, lat: e.latlng.lat, lng:e.latlng.lng });

    //Get Address of picked point (method with callback to get address from function module GeocodeReverse)
    await geocodeReverse(
      e.latlng.lat,
      e.latlng.lng,
      props.handleLocation,
      setCenter
    );

    //reset errors messages
    setErrors({ path: "", message: "" });
  };

  const handleTypedAddress = async (e) => {
    await geocodeForward(
      props.report.location,
      props.handleLocation,
      setPickedPosition,
      setCenter
    );
  };

  const keyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.name !== "circonstances") e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <InputLabel>date of missing</InputLabel>
        </Grid>
        <Grid item xs={12}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              label="Date of missing"
              format="dd/MM/yyyy"
              name="date"
              value={props.report.date}
              maxDate={new Date()}
              onChange={(value) => props.handleChange(null, value)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              onKeyDown={keyPress}
            />
            <br /> <br />
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={12}>
          <InputLabel>Circonstances</InputLabel>
          <TextField
            multiline
            rows="5"
            placeholder="give any detail about your animal's disappearance"
            variant="filled"
            value={props.report.circonstances}
            onChange={(e) => props.handleChange(e)}
            name="circonstances"
            style={{ width: 300 }}
            onKeyDown={keyPress}
          />
        </Grid>
        <br />
        <Grid item xs={12}>
          <br />
          <InputLabel>
            Location of the event <br />
            (Write the address or click on the map)
          </InputLabel>
          <TextField
            multiline
            label="Address"
            value={props.report.location}
            onChange={(e) => props.handleChange(e)}
            onBlur={(e) => handleTypedAddress(e)}
            onKeyDown={keyPress}
            name="location"
            variant="filled"
            required
            helperText="Required"
            style={{ width: 400 }}
            error={errors.path === "location"}
            id="location"
          />
          <br />
          <br />

          <Map
            center={[center.lat, center.lng]}
            zoom={center.zoom}
            style={{
              width: "85vh",
              height: "55vh",
              margin: "auto",
              cursor: "pointer",
            }}
            onClick={(e) => handleClickonMap(e)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {pickedPosition && (
              <Marker position={pickedPosition} draggable={false}></Marker>
            )}
          </Map>
        </Grid>
      </Grid>
      {
        <div className={classes.error}>
          <br />
          <br />
          {errors.message}
        </div>
      }
      <div className={classes.actionsContainer}>
        <div>
          <Button onClick={props.handleBack} className={classes.button}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              validationNext(
                validationSchema,
                props.report,
                props.handleNext,
                setErrors
              )
            }
            className={classes.button}
          >
            Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
