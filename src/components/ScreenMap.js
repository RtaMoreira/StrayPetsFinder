import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import MapOfReports from "./MapOfReports";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ListOfReports from "./ListOfReports";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import {
  getCurrentLocation,
  getDistanceFromLatLonInKm,
  geocodeForward,
} from "../functions/geoCoding";

const ScreenMap = (props) => {
  const [reports, setReports] = useState([]);
  const [reportsFiltered, setReportsFiltered] = useState([]);
  const [position, setPosition] = useState({});
  const [city, setCity] = useState({ lat: 0, lng: 0, location: "" });
  const [manualLocation, setManualLocation] = useState(false);

  const [filtersSelected, setFiltersSelected] = useState([]);
  const [statusFilters, setStatusFilters] = useState([
    { key: 0, label: "lost", disabled: false },
    { key: 1, label: "found", disabled: false },
  ]);

  const [animalFilters, setAnimalFilters] = useState([
    { key: 2, label: "Dog", disabled: false },
    { key: 3, label: "Cat", disabled: false },
    { key: 4, label: "Rabbit", disabled: false },
  ]);

  const [dataReady, setDataReady] = useState(false);

  //Get all reports from collection
  useEffect(() => {
    //get reports
    const getReports = async () => {
      await db
        .collection("reports")
        .get()
        .then((snapshot) => {
          var reports = snapshot.docs.map((doc) => doc.data());

          reports.forEach((report) => {
            report.date = report.date.toDate();
          });

          setReports(reports);
          setReportsFiltered(reports);
        });
    };

    getReports();

    //get  location
    getCurrentLocation(showCurrentPosition, showDefaultPosition);
  }, []);

  useEffect(() => {
    const calculateDistanceOfReports = async () => {
      var reportsWithDistance = reports;
      await reportsWithDistance.forEach((report) => {
        report.distanceFromPosition = getDistanceFromLatLonInKm(
          report.lat,
          report.lng,
          position.lat,
          position.lng
        );
      });
      setReports(reportsWithDistance);
      setReportsFiltered(reportsWithDistance);
    };

    if (!manualLocation) calculateDistanceOfReports();
  }, [position, reports, manualLocation]);

  //when a filter is selected or removed, update shown reports
  useEffect(() => {
    //update setReports following filters
    const updateReports = () => {
      var reportsToBefiltered = reports;
      filtersSelected.forEach((filter) => {
        if (filter.label === "lost" || filter.label === "found") {
          reportsToBefiltered = reportsToBefiltered.filter(
            (report) => report.status === filter.label
          );
        } else {
          reportsToBefiltered = reportsToBefiltered.filter(
            (report) => report.animal === filter.label
          );
        }
        setReportsFiltered(reportsToBefiltered);
      });

      //if no filter selected show all reports
      if (filtersSelected.length === 0) {
        setReportsFiltered(reports);
      }
    };

    updateReports();
  }, [filtersSelected,reports]);

  //callback method used to save current position
  const showCurrentPosition = (coordinates) => {
    setPosition({
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    });

    setDataReady(true);
  };

  //callback method used when access denied to current location
  const showDefaultPosition = (error) => {
    console.log(
      "you denied the geolocation, default position set to Vevey, CH"
    );

    setPosition({
      lat: 46.46299, //Vevey, CH by default
      lng: 6.84345,
    });

    setManualLocation(true);
    setDataReady(true);
  };

  const handleTypedPosition = async (e) => {
    await geocodeForward(city.location, null, showTypedPosition, null);
  };

  const showTypedPosition = (coordinates) => {
    setPosition({
      lat: coordinates.lat,
      lng: coordinates.lng,
    });
  };

  const removeFilter = (chipToDelete) => () => {
    setFiltersSelected((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    ); //remove

    if (chipToDelete.label === "lost" || chipToDelete.label === "found")
      setStatusFilters(
        statusFilters.map((filter) => {
          //Enable these filters for selection again
          filter.disabled = false;
          return filter;
        })
      );
    else
      setAnimalFilters(
        animalFilters.map((filter) => {
          //Enable these filters from any other selection
          filter.disabled = false;
          return filter;
        })
      );
  };

  const selectFilter = (selectedChip) => {
    setFiltersSelected((filtersSelected) => [...filtersSelected, selectedChip]); //update selected filters

    if (selectedChip.label === "lost" || selectedChip.label === "found")
      setStatusFilters(
        statusFilters.map((filter) => {
          //disable these filters from any other selection
          filter.disabled = true;
          return filter;
        })
      );
    else
      setAnimalFilters(
        animalFilters.map((filter) => {
          //disable these filters from any other selection
          filter.disabled = true;
          return filter;
        })
      );
  };

  return (
    <Grid container>
      {dataReady ? (
        <Grid container justify="space-around">
          <Grid item xs={8} sm={12}>
            <br />
            <Grid container justify="space-around" direction="row">
              <Grid item xs={12} sm={8}>
                <Paper>
                  <MapOfReports
                    reports={reportsFiltered}
                    centerMap={position}
                    key="map"
                  />
                </Paper>
                <br />
              </Grid>
              <Grid
                container
                xs={12}
                sm={3}
                direction="column"
                justify="center"
              >
                <Grid item>
                  <br />
                  <Typography variant="h5">Search</Typography>
                  <br />
                  <Divider />
                  <br />

                  <Typography variant="h7">Active filters :</Typography>
                  {filtersSelected
                    ? filtersSelected.map((filter) => {
                        return (
                          <Chip
                            key={filter.key}
                            label={filter.label}
                            name={filter.label}
                            color={filter.key < 2 ? "secondary" : "primary"}
                            style={{ margin: 5 }}
                            clickable
                            onDelete={removeFilter(filter)}
                          />
                        );
                      })
                    : " "}
                  <br />
                  <Typography variant="h7">Filters :</Typography>
                  <br />

                  {statusFilters.map((filter) => {
                    return (
                      <Chip
                        key={filter.key}
                        label={filter.label}
                        color="secondary"
                        clickable
                        onClick={() => selectFilter(filter)}
                        disabled={filter.disabled ? true : false}
                        style={{ margin: 5 }}
                      />
                    );
                  })}
                  <br />
                  {animalFilters.map((filter) => {
                    return (
                      <Chip
                        key={filter.key}
                        label={filter.label}
                        color="primary"
                        clickable
                        onClick={() => selectFilter(filter)}
                        disabled={filter.disabled ? true : false}
                        style={{ margin: 5 }}
                      />
                    );
                  })}
                </Grid>
                <br />

                <Divider />

                <Grid item>
                  <p>Show a particular area in the map:</p>
                  <TextField
                    label="Enter a city or address"
                    id="city"
                    name="city"
                    value={city.location}
                    variant="outlined"
                    onChange={(e) =>
                      setCity({ ...city, location: e.target.value })
                    }
                    size="small"
                  ></TextField>{" "}
                  <Button
                    onClick={(e) => handleTypedPosition(e)}
                    variant="outlined"
                  >
                    search
                  </Button>
                </Grid>
                <br />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <ListOfReports
              reports={reportsFiltered}
              manualLocation={manualLocation}
              key="list"
            />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <CircularProgress />
          Please allow this site to get your position
        </Grid>
      )}

      <Grid item xs={12} sm={12}>
        <div style={{ marginBottom: "0.5em", fontSize: "0.8em" }}>
          <br /> Prototype of a platform for stray pets reports (Version 0.2)
        </div>{" "}
      </Grid>
    </Grid>
  );
};

export default ScreenMap;
