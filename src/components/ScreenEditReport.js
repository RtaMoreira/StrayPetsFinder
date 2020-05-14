import React, { useEffect } from "react";
import { FirebaseContext } from "../firebaseConfig";
import ScreenAddLostReport from "./ScreenAddLostReport";
import { useHistory } from "react-router-dom";


const ScreenEditReport = (props) => {
  const { user } = React.useContext(FirebaseContext);
  const history = useHistory(); //to get back on the previous page


  useEffect(() => {
    if (user.uid === undefined)
      //if not logged in redirect to signIn page
      history.push("/signIn");
  }, [user, history]);
  return user.uid?(
    <div>
      <ScreenAddLostReport report={props.location.state.report} />
    </div>
  ): "";
};

export default ScreenEditReport;
