import React, { useEffect, useState } from "react";
import { db} from "../firebaseConfig";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import { useHistory } from "react-router-dom";
import style from "../assets/style";
//mini forms :
import ReviewReport from "./lostReports-forms/ReviewReport";
import PersonalInformationForm from "./lostReports-forms/PersonalInformationForm";
import AnimalSpecies from "./lostReports-forms/AnimalSpecies";
import AnimalInfo from  "./lostReports-forms/AnimalInfo";
import AnimalPicture from  "./lostReports-forms/AnimalPicture";
import EventInfo from  "./lostReports-forms/EventInfo";



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
  petOptions
) {
  switch (stepIndex) {
    case 0:
      return (
        <PersonalInformationForm
          handleNext={handleNext}
          handleBack={handleBack}
          activeStep={activeStep}
          handleChange={handleChange}
          report={report}
        />
      );
    case 1:
      return (
        <AnimalSpecies
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange}
          petOptions={petOptions}
          report={report}
        />
      );
    case 2:
      return (
        <AnimalInfo
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange}
          report={report}
          petOptions={petOptions}
        />
      );
    case 3:
      return (
        <AnimalPicture
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange}
          report={report}
          handleImageUrl={handleImageUrl}
        />
      );
    case 4:
      return (
        <EventInfo
          handleNext={handleNext}
          handleBack={handleBack}
          handleChange={handleChange}
          report={report}
          handleLocation={handleLocation}
        />
      );

    default:
      return "Unknown stepIndex";
  }
}

const ScreenAddLostReport = () => {
  const classes = style();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [petOptions, setPetOptions] = useState([]); //options for form (size, coat color, coat type,...) 
  const history = useHistory(); //to get back on the previous page

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
  //Get options for pets (size, species, coat color, coat type)
    db.collection("coat").get().then((snapshot)=>{
      snapshot.docs.map(doc => {           
        setPetOptions((petOptions) => [...petOptions, doc.data()]);          
      });       
    })

  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //Change location when location picked on the map (is used as callback on a geocoding function)
  const handleLocation = (lat, lng, address) => {
    setReport({ ...report, location: address, lat: lat, lng: lng });
    console.log(report);
  };


  //Some components handle changes differently : some pass values (autocomplete fields), other no
  const handleChange = (e, value = "") => {
    //regular textfields (no value passed)
    if (value === "") {
      setReport({ ...report, [e.target.name]: e.target.value });
    } else {
      //autocomplete fields : setState in attribute directly (because no event (e) is passed)
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

      //date picker field (only a value is passed)
      if (value instanceof Date) {
        setReport({ ...report, date: value });
      }
    }

    console.log(report);
  };

  //Change image url when new image is uploaded
  const handleImageUrl = (url) => {
    setReport({ ...report, imageUrl: url });
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
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length?
        <ReviewReport report={report} sendReport={sendReport} handleBack={handleBack}/>:""
      }
    </div>
  );
};

export default ScreenAddLostReport;
