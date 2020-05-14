import React, { useEffect, useState } from "react";
import { FirebaseContext } from "../firebaseConfig";
import Stepper from "@material-ui/core/Stepper";
import Grid from "@material-ui/core/Grid";

import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import { useHistory } from "react-router-dom";
import style from "../assets/style";
import { getCurrentLocation } from "../functions/geoCoding";
import CircularProgress from "@material-ui/core/CircularProgress";

//mini forms :
import ReviewReport from "./lostReports-forms/ReviewReport";
import AnimalSpecies from "./lostReports-forms/AnimalSpecies";
import AnimalInfo from "./lostReports-forms/AnimalInfo";
import AnimalPicture from "./lostReports-forms/AnimalPicture";
import EventInfo from "./lostReports-forms/EventInfo";

function getSteps() {
  return [
    // "Personal information",
    "Your animal's species ",
    "Information about your animal",
    "Picture(s) of your animal",
    "Event's circonstances",
    "Review",
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
  sendReport
) {
  switch (stepIndex) {
    case 0:
      return (
        <AnimalSpecies
          handleNext={handleNext}
          handleBack={handleBack}
          activeStep={activeStep}
          handleChange={handleChange}
          petOptions={petOptions}
          report={report}
        />
      );
    case 1:
      return (
        <AnimalInfo
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange}
          report={report}
          petOptions={petOptions}
        />
      );
    case 2:
      return (
        <AnimalPicture
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange}
          report={report}
          handleImageUrl={handleImageUrl}
        />
      );
    case 3:
      return (
        <EventInfo
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange}
          report={report}
          handleLocation={handleLocation}
        />
      );
    case 4:
      return (
        <ReviewReport
          report={report}
          sendReport={sendReport}
          handleBack={handleBack}
        />
      );
    default:
      return "default case;";
  }
}

const ScreenAddLostReport = (props) => {
  const classes = style();
  const { user, db } = React.useContext(FirebaseContext);
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [petOptions, setPetOptions] = useState([]); //options for form (size, coat color, coat type,...)
  const history = useHistory(); //to get back on the previous page
  let editReady = false;

  //if props.report = EDIT MODE (vs) ADD MODE
  const [report, setReport] = useState(
    props.report || {
      firstname: "",
      lastname: "",
      email: "",
      date: new Date(),
      animal: "",
      petName: "",
      petAge: 1,
      petGender: "",
      petBreed: "",
      petCoatType: "",
      petCoatColor: [],
      petEyesColor: [],
      petSize: "",
      petParticularInfo: "",
      circonstances: "",
      status: "lost",
      location: "",
      imageUrl: "no image",
      lat: 0,
      lng: 0,
    }
  );

  useEffect(() => {
    if (user === null) {
      //if not logged in redirect to signIn page
      history.push("/signIn");
    } else {
      //Get options for pets (size, species, coat color, coat type)
      const getPetOptions = async () => {
        await db
          .collection("coat")
          .get()
          .then((snapshot) => {
            snapshot.docs.map((doc) => 
              setPetOptions((petOptions) => [...petOptions, doc.data()])
            );
          });
      };
      //get PetOptions
      getPetOptions();

      const showCurrentPosition = (position) => {
        setReport({
          ...report,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      };

      //ADD MODE : Get current location (if edit mode -> given  by props.report)
      if (!props.report) getCurrentLocation(showCurrentPosition);
    }
  }, [user, history, db]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //Change location when location picked on the map (is used as callback on a geocoding function)
  const handleLocation = (lat, lng, address) => {
    setReport({ ...report, location: address, lat: lat, lng: lng });
  };

  //Some components handle changes differently : some pass values (autocomplete fields), other no
  const handleChange = (e, value = "") => {
    //regular textfields (no value passed)
    if (value === "") {
      setReport({ ...report, [e.target.name]: e.target.value });
    } else {
      if (e === "coatColor") setReport({ ...report, petCoatColor: value });
      else if (e === "eyesColor") setReport({ ...report, petEyesColor: value });
      else
        for (var poperty in value) {
          if (poperty === "breed")
            setReport({ ...report, petBreed: value.breed });
          else if (poperty === "size")
            setReport({ ...report, petSize: value.size });
          else if (poperty === "coatType")
            setReport({ ...report, petCoatType: value.coatType });
          else setReport({ ...report, [e.target.name]: e.target.value }); //PetCoatColor and PetEyesColor
        }
      //date picker field (only a value is passed)
      if (value instanceof Date) {
        setReport({ ...report, date: value });
      }
    }

  };

  //Change image url when new image is uploaded
  const handleImageUrl = (url) => {
    setReport({ ...report, imageUrl: url });
  };

  const sendReport = () => {
    //EDIT MODE : update report
    if (report.id) {
      db.collection("reports")
        .doc(report.id)
        .update(report)
        .then(function () {
          console.log("Document successfully updated!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    } else {
      // ADD MODE : Add a new document with a generated id.
      db.collection("reports")
        .add({
          ...report,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }

    //redirect to revious page
    history.goBack();
  };

  return petOptions[4] || (editReady && props.report) ? (
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
                sendReport
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
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
    </Grid>
  );
};

export default ScreenAddLostReport;
