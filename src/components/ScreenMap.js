import React, { Component } from "react";
import { db } from "../firebaseConfig";
import MapOfReports from "./MapOfReports";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

class ScreenMap extends Component {
  state = {
    reports: []
  };

  async componentDidMount() {
    const snapshot = await db.collection("reports").get();

    var reports = snapshot.docs.map(doc => doc.data());
    //format data
    /*  reports = reports.map(report =>{
            report.petCoatColor = report.petCoatColor.toString()
            console.log(report.petCoatColor);
        })
        console.log(reports);
*/
    this.setState({ reports: reports });
  }

  render() {
    return (
      <Grid container justify="space-around">
        <Grid item xs={12} sm={12}>
          <div>
            <p>
              Did you lose your pet? Or found one? <br />
              Report it here and help the community!{" "}
            </p>
          </div>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper>
            <MapOfReports reports={this.state.reports} key={"map"} />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12}><div style={{marginBottom:"0.5em", fontSize:"0.8em"}}><br/> Prototype of a platform for stray pets reports (Version 0.1)</div> </Grid>
      </Grid>
    );
  }
}
export default ScreenMap;
