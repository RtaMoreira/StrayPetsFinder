import React, { useEffect, useState } from "react";
import { db, storage } from "../firebaseConfig";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getCurrentLocation, geocodeReverse } from "../functions/geoCoding";
import { validationNext } from "../functions/validation";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

//circonstances
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Map, TileLayer, Marker } from "react-leaflet";

import { dogBreeds, catBreeds, rabbitBreeds } from "../assets/breeds";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  imgStyle: {
    height: "auto",
    width: "40%",
    margin: "auto",
  },
  error: {
    color: "red",
  },
}));

function getSteps() {
  return [
    "Personal information",
    "Your animal's species ",
    "Information about your animal",
    "Picture(s) of your animal",
    "Event's circonstances",
  ];
}

function getStepContent(
  stepIndex,
  handleNext,
  handleBack,
  activeStep,
  handleChange,
  handleLocation,
  handleImageUrl,
  report,
  petOptions,
  setReport
) {
  switch (stepIndex) {
    case 0:
      return (
        <PersonalInformationForm
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange.bind(this)}
          activeStep={activeStep}
          report={report}
          setReport={setReport}
        />
      );
    case 1:
      return (
        <AnimalSpecies
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange.bind(this)}
          activeStep={activeStep}
          petOptions={petOptions}
          report={report}
        />
      );
    case 2:
      return (
        <AnimalInfo
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange.bind(this)}
          activeStep={activeStep}
          report={report}
          petOptions={petOptions}
        />
      );
    case 3:
      return (
        <AnimalPicture
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange.bind(this)}
          activeStep={activeStep}
          report={report}
          handleImageUrl={handleImageUrl}
        />
      );
    case 4:
      return (
        <EventInfo
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange.bind(this)}
          activeStep={activeStep}
          report={report}
          handleLocation={handleLocation}
        />
      );

    default:
      return "Unknown stepIndex";
  }
}

const AddLostReport = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [petOptions, setPetOptions] = useState([]);
  const history = useHistory();

  const [report, setReport] = useState({
    date: new Date(),
    firstname: "",
    lastname: "",
    email: "",
    animal: "",
    petName: "",
    petAge: 1,
    petGender: "",
    petBreed: "",
    petCoatType: "",
    petCoatColor: [],
    petEyesColor: "",
    petSize: "",
    petParticularInfo: "",
    circonstances: "",
    status: "lost",
    location: "",
    imageUrl: "no image",
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    getOptions();
  }, []);

  //Get options for pets (size, species, coat color, coat type)
  const getOptions = async () => {
    let OptionsRef = db.collection("coat");
    let allOptions = await OptionsRef.get();
    for (const doc of allOptions.docs) {
      console.log(doc.id, "=>", doc.data());
      setPetOptions((petOptions) => [...petOptions, doc.data()]);
    }
  };

  const handleNext = () => {
    console.log("NEXT CALL");
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleLocation = (lat, lng, address) => {
    setReport({ ...report, location: address, lat: lat, lng: lng });
    console.log(report);
  };

  const handleChange = (e, value = "") => {
    //regular textfields
    if (value === "") {
      console.log("event value :", e.target.value);
      setReport({ ...report, [e.target.name]: e.target.value });
    } else {
      //autocomplete fields : setState in attribute directly (bc not working with event(e))
      console.log("value :", value);

      for (var poperty in value)
        if (poperty === "breed")
          setReport({ ...report, petBreed: value.breed });
        else if (poperty === "size")
          setReport({ ...report, petSize: value.size });
        else if (poperty === "coatColor")
          setReport({ ...report, petCoatColor: value.coatColor });
        else if (poperty === "coatType")
          setReport({ ...report, petCoatType: value.coatType });
        else if (poperty === "eyesColor")
          setReport({ ...report, petEyesColor: value.eyesColor });

      //date format
      if (value instanceof Date) {
        setReport({ ...report, date: value });
      }
    }

    console.log(report);
  };

  const handleImageUrl = (url) => {
    console.log("HANDLE IMAGE from PARENT");

    setReport({ ...report, imageUrl: url });
    console.log(url);
  };

  const sendReport = () => {
    // Add a new document with a generated id.
    db.collection("reports")
      .add(report)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });

    //redirect to home page
    history.goBack();
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(
                index,
                handleNext,
                handleBack,
                activeStep,
                handleChange,
                handleLocation,
                handleImageUrl,
                report,
                petOptions,
                setReport
              )}
              <div className={classes.actionsContainer}></div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>Please review your report before publishing</Typography>
          <div dividers>
            <img
              src={report.imageUrl}
              width="200px"
              height="auto"
              alt="animal"
            />
            <br />
            Your name: {report.firstname + " " + report.lastname}
            <br />
            Your email: {report.email}
            <br />
            Name: {report.petName ? report.petName : "?"}
            <br />
            Age: {report.petAge ? report.petAge + " years old" : "?"}
            <br />
            Gender: {report.petGender ? report.petGender : "?"} <br />
            Breed: {report.petBreed ? report.petBreed : "?"}
            <br />
            Coat type: {report.petCoatType
              ? report.petCoatType + " hair"
              : "?"}{" "}
            <br />
            Coat color(s):{" "}
            {report.petCoatColor ? report.petCoatColor.toString() : "?"}
            <br />
            Eyes color: {report.petEyesColor ? report.petEyesColor : "?"}
            <br />
            Pet size: {report.petSize ? report.petSize : "?"}
            <br />
            Particular information:{" "}
            {report.petParticularInfo ? report.petParticularInfo : "-"} <br />
            Circonstances: {report.circonstances ? report.circonstances : "-"}
            <br />
            Location : {report.location}
          </div>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            className={classes.button}
            onClick={sendReport}
            variant="contained"
            color="primary"
          >
            Publish my report
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default AddLostReport;

function PersonalInformationForm(props) {
  const classes = useStyles();
  const [errors, setErrors] = useState({ path: "", message: "" });

  const validationSchema = yup.object().shape({
    firstname: yup.string().required("Firstname is required").max(20),
    lastname: yup.string().required("Lastname is required").max(20),
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <form>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            label="Firstname"
            id="firstname"
            name="firstname"
            value={props.report.firstname}
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            error={errors.path === "firstname"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Lastname"
            id="lastname"
            name="lastname"
            value={props.report.lastname}
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            error={errors.path === "lastname"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            label="Email"
            id="email"
            name="email"
            value={props.report.email}
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            type="email"
            error={errors.path === "email"}
          />
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
          <Button
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() =>
              validationNext(
                validationSchema,
                props.report,
                props.handleNext,
                setErrors
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}

function AnimalSpecies(props) {
  const classes = useStyles();
  const [errors, setErrors] = useState({ path: "", message: "" });

  const validationSchema = yup.object().shape({
    animal: yup.string().required("Species is required"),
  });

  return (
    <FormControl variant="filled" className={classes.formControl}>
      <InputLabel>Species</InputLabel>

      <Select
        id="animal"
        name="animal"
        value={props.report.animal}
        onChange={(e) => props.handleChange(e)}
        error={errors.path === "animal"}
      >
        {props.petOptions[3].species.map((species, key) => {
          return (
            <MenuItem value={species} key={key}>
              {species}
            </MenuItem>
          );
        })}
      </Select>
      {
        <div className={classes.error}>
          <br />
          <br />
          {errors.message}
        </div>
      }

      <div className={classes.actionsContainer}>
        <div>
          <Button
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            className={classes.button}
          >
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
            Next
          </Button>
        </div>
      </div>
    </FormControl>
  );
}

function AnimalInfo(props) {
  const classes = useStyles();
  const [coatType, setCoatType] = useState([{ coatType: "?" }]);
  const [coatColor, setCoatColor] = useState([{ coatColor: "?" }]);
  const [size, setSize] = useState([{ size: "?" }]);
  const [eyesColor, setEyesColor] = useState([{ eyesColor: "?" }]);
  //validation form
  const [errors, setErrors] = useState({ path: "", message: "" });
  const validationSchema = yup.object().shape({
    petName: yup.string().required("Your pet's name is required"),
    petAge: yup.string().required("Your pet's age is required"),
    petGender: yup.string().required("Your pet's gender is required"),
    petBreed: yup.string().required("Your pet's breed is required"),
    petCoatType: yup.string().required("Your pet's coat type is required"),
    petCoatColor: yup.string().required("Your pet's coat color is required"),
    petEyesColor: yup.string().required("Your pet's eyes color is required"),
    petSize: yup.string().required("Your pet's size is required"),
  });
  useEffect(() => {
    formatOptions();
  }, [props.petOptions]);

  //format option for Autocomplete form
  const formatOptions = () => {
    props.petOptions[4].type.map((option) => {
      return setCoatType((coatType) => [...coatType, { coatType: option }]);
    });

    props.petOptions[0].color.map((option) => {
      return setCoatColor((coatColor) => [...coatColor, { coatColor: option }]);
    });

    props.petOptions[2].size.map((option) => {
      return setSize((size) => [...size, { size: option }]);
    });
    props.petOptions[1].color.map((option) => {
      return setEyesColor((eyesColor) => [...eyesColor, { eyesColor: option }]);
    });
  };

  /*const getBreedsMenu = () => {
    const animal = props.report.animal;
    let breed = [];
    let menu;

    if (animal === "Dog") breed = dogBreeds;
    else if (animal === "Cat") breed = catBreeds;
    else if (animal === "Rabbit") breed = rabbitBreeds;

    if (breed !== []) {
      menu = breed.map((breed, key) => {
        return (
          <MenuItem value={breed} key={key}>
            {breed}
          </MenuItem>
        );
      });
      return menu;
    }
  };

  <Grid item xs={12}>
          <InputLabel id="demo-simple-select-filled-label">Breed</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            name="petBreed"
            value={props.report.petBreed}
            onChange={e => props.handleChange(e)}
          >
            <MenuItem value="" key="">
              I don't know
            </MenuItem>
            {getBreedsMenu()}
          </Select>
        </Grid>
*/
  return (
    <form className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Your pet's name"
            value={props.report.petName}
            id="petName"
            name="petName"
            onChange={(e) => props.handleChange(e)}
            variant="filled"
            required
            error={errors.path === "petName"}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Your pet's age"
            value={props.report.petAge}
            name="petAge"
            id="petAge"
            onChange={(e) => props.handleChange(e)}
            type="number"
            inputProps={{ min: "1", step: "1" }}
            variant="filled"
            required
            error={errors.path === "petAge"}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Gender</InputLabel>
          <Select
            variant="filled"
            label="Gender"
            name="petGender"
            id="petGender"
            value={props.report.petGender}
            onChange={(e) => props.handleChange(e)}
            error={errors.path === "petGender"}
          >
            <MenuItem value="Male" key="Male">
              Male
            </MenuItem>
            <MenuItem value="Female" key="Female">
              Female
            </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Breed</InputLabel>
          <Autocomplete
            options={
              props.report.animal === "Dog"
                ? dogBreeds
                : props.report.animal === "Cat"
                ? catBreeds
                : rabbitBreeds
            }
            getOptionLabel={(option) => (option.breed ? option.breed : option)}
            style={{ width: 300, margin: "auto" }}
            value={props.report.petBreed}
            onChange={(e, values) => {
              console.log(coatType);
              props.handleChange(e, values);
            }}
            renderInput={(params) => <TextField {...params} variant="filled" />}
            disableClearable
            error={errors.path === "petBreed"}
            id="petBreed"
            name="petBreed"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Pet size</InputLabel>
          <Autocomplete
            key={props.report.petSize}
            options={size}
            getOptionLabel={(option) => (option.size ? option.size : option)}
            style={{ width: 300, margin: "auto" }}
            value={props.report.petSize}
            onChange={(e, values) => {
              props.handleChange(e, values);
            }}
            renderInput={(params) => <TextField {...params} variant="filled" />}
            disableClearable
            error={errors.path === "petSize"}
            id="petSize"
            name="petSize"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Coat Type</InputLabel>
          <Autocomplete
            key={props.report.petCoatType}
            options={coatType}
            getOptionLabel={(option) =>
              option.coatType ? option.coatType : option
            }
            style={{ width: 300, margin: "auto" }}
            value={props.report.petCoatType}
            onChange={(e, values) => {
              props.handleChange(e, values);
            }}
            renderInput={(params) => <TextField {...params} variant="filled" />}
            disableClearable
            error={errors.path === "petCoatType"}
            id="petCoatType"
            name="petCoatType"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Coat Color</InputLabel>
          <Autocomplete
            key={props.report.petCoatColor}
            options={coatColor}
            getOptionLabel={(option) =>
              option.coatColor ? option.coatColor : option
            }
            style={{ width: 300, margin: "auto" }}
            value={props.report.petCoatColor}
            onChange={(e, values) => {
              props.handleChange(e, values);
            }}
            renderInput={(params) => <TextField {...params} variant="filled" />}
            disableClearable
            error={errors.path === "petCoatColor"}
            id="petCoatColor"
            name="petCoatColor"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Eyes color</InputLabel>
          <Autocomplete
            key={props.report.petEyesColor}
            options={eyesColor}
            getOptionLabel={(option) =>
              option.eyesColor ? option.eyesColor : option
            }
            style={{ width: 300, margin: "auto" }}
            value={props.report.petEyesColor}
            onChange={(e, values) => {
              props.handleChange(e, values);
            }}
            renderInput={(params) => <TextField {...params} variant="filled" />}
            disableClearable
            error={errors.path === "petEyesColor"}
            id="petEyesColor"
            name="petEyesColor"
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Particular information</InputLabel>
          <TextField
            multiline
            rows="5"
            placeholder="add any particular information about your animal (collar, health problems, personality, etc.)"
            variant="filled"
            value={props.report.petParticularInfo}
            onChange={(e) => props.handleChange(e)}
            name="petParticularInfo"
            style={{ width: 300 }}
          />
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
          <Button
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            className={classes.button}
          >
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
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}

function AnimalPicture(props) {
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState(
    props.report.imageUrl === "no image" ? "" : props.report.imageUrl
  );
  //validation form
  const [errors, setErrors] = useState({ path: "", message: "" });
  const validationSchema = yup.object().shape({
    imgPreview: yup.string().required("An image of your pet is required"),
  });
  const classes = useStyles();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      const fileSelected = e.target.files[0];
      console.log(e.target.files[0]);
      setImage(fileSelected); //save brut image object

      setImgPreview(URL.createObjectURL(fileSelected)); //save local url for preview
      console.log(imgPreview);

      //reset errors msg when image is picked
      setErrors({ path: "", message: "" });
    }
  };

  const sendImageUrl = (url) => {
    props.handleImageUrl(url);
  };

  //image upload (with blob)
  const handleUpload = () => {
    console.log(image);
    const uploadTask = storage
      .ref("images")
      .child(props.report.email)
      .child(image.name)
      .put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        storage
          .ref("images")
          .child(props.report.email)
          .child(image.name)
          .getDownloadURL()
          .then((urlimage) => {
            console.log("url download", urlimage);
            sendImageUrl(urlimage);
          });
      }
    );
  };

  //HandleClick : when click next : validate if image picked, upload it if not done before, go to next step
  const handleClick = async () => {
    console.log("VALIDATION ");
    await validationSchema
      .validate({ imgPreview: imgPreview })
      .then((result) => {
        if (
          (props.report.imageUrl === "no image" && imgPreview !== "") ||
          (props.report.imageUrl !== "no image" &&
            imgPreview !== props.report.imageUrl)
        )
          //if new img picked, got downloaded
          handleUpload();
        //next step
        props.handleNext();
      })
      .catch((err) => {
        console.log(err);
        setErrors(err);
      });
  };

  return (
    <div>
      <Grid container spacing={0} justifyContent="center">
        <Grid item xs={12}>
          <InputLabel>Pick an image</InputLabel>
        </Grid>
        <Grid item xs={12}>
          <input
            style={{ display: "none" }}
            accept="image/*"
            id="imageUrl"
            type="file"
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="imageUrl">
            <Button
              variant="contained"
              color="primary"
              component="span"
              onChange={(e) => handleChange(e)}
            >
              Upload
            </Button>
          </label>
        </Grid>
        {imgPreview !== "" ? (
          <img
            src={imgPreview}
            alt="Uploaded images"
            className={classes.imgStyle}
          />
        ) : (
          ""
        )}
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
          <Button
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleClick()}
            className={classes.button}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function EventInfo(props) {
  const classes = useStyles();
  const [center, setCenter] = useState({
    lat: 60.199999,
    lng: 24.93777,
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
    getCurrentLocation(showCurrentPosition);
  }, []);

  const showCurrentPosition = (position) => {
    console.log("showcurentPos :", position);
    setCenter({ ...center, lat: position.coords.latitude });
    setCenter({ ...center, lng: position.coords.longitude });
  };

  const handleClickonMap = async (e) => {
    console.log("handClick :", e.latlng);
    setPickedPosition(e.latlng);
    //Get Address of picked point (method with callback to get address from function module GeocodeReverse)
    await geocodeReverse(e.latlng.lat, e.latlng.lng, props.handleLocation);

    //reset errors messages
    setErrors({ path: "", message: "" });
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
          />
        </Grid>
        <br />
        <Grid item xs={12}>
          <br />
          <InputLabel>
            Location of the event <br />
            (Click on the map to pick a location)
          </InputLabel>
          <TextField
            multiline
            label="Address"
            value={props.report.location}
            onChange={(e) => props.handleChange(e)}
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
            style={{ width: "85vh", height: "55vh", margin: "auto", cursor:'pointer' }}
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
          <Button
            disabled={props.activeStep === 0}
            onClick={props.handleBack}
            className={classes.button}
          >
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
}
