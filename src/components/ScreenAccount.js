import React, { useEffect, useState, useCallback } from "react";
import { FirebaseContext } from "../firebaseConfig";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import TableIcons from "../assets/TableIcons";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useHistory } from "react-router-dom";

const placeholder = "../assets/placeholder.svg";

const ScreenAccount = () => {
  const { user, db } = React.useContext(FirebaseContext);
  const [userInfo, setUserInfo] = useState({});
  const [reports, setReports] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  let history = useHistory();

  //get reports of user
  const fetchReports = useCallback(() => {
    var ReportsUpdated = [];
    db.collection("reports")
      .where("email", "==", user.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let report = doc.data();
          report.date = report.date.toDate(); // format date
          report.id = doc.id; //save id document
          ReportsUpdated.push(report);
        });
        setReports(ReportsUpdated);
      });
  }, [db]);

  useEffect(() => {
    if (user.uid === null) {
      setDataReady(false);
      setTimeout(() => {
        //if not logged in redirect to signIn page after 4 seconds
        if (user.uid === null) history.push("/");
      }, 2000);
    } else {
      //get user info
      setUserInfo(user);

      //get Reports of user
      var ReportsUpdated = [];
      db.collection("reports")
        .where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let report = doc.data();
            report.date = report.date.toDate(); // format date
            report.id = doc.id; //save id document
            ReportsUpdated.push(report);
          });
          setReports(ReportsUpdated);
        });

      setDataReady(true);
    }
  }, [user, db]);

  //delete reports
  const deleteReport = (reportId) => {
    db.collection("reports")
      .doc(reportId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
        //fetch reports again
        fetchReports();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  return dataReady ? (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid item xs={12}>
        Personal Information <br />
        <p>
          Name : {userInfo.firstname} {userInfo.lastname}
        </p>
        <p>Email : {userInfo.email}</p>
        <p>Address : {userInfo.address}</p>
        <p>
          City : {userInfo.city}, {userInfo.zipcode}
        </p>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <MaterialTable
            icons={TableIcons}
            columns={[
              {
                title: " ",
                field: "imageUrl",
                render: (rowData) => (
                  <img
                    alt={
                      "image of " +
                      rowData.petName +
                      " for report published on " +
                      rowData.date
                    }
                    src={
                      rowData.imageUrl !== "" ? rowData.imageUrl : placeholder
                    }
                    style={{ width: 150, borderRadius: "2%" }}
                  />
                ),
              },

              { title: "Nom", field: "petName" },
              { title: "Status", field: "status" },
              { title: "Animal", field: "animal" },
              { title: "Location", field: "location" },
              { title: "Date", field: "date", type: "date" },
            ]}
            data={reports}
            title="Your reports"
            editable={{
              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve();
                    deleteReport(oldData.id);
                  }, 600);
                }),
            }}
            localization={{
              body: {
                editRow: {
                  deleteText: "Are you sure you want to delete this report?",
                },
              },
            }}
            actions={[
              {
                icon: TableIcons.Edit,
                tooltip: "Edit",
                onClick: (event, rowData) =>
                  history.push({
                    pathname: "/edit-report",
                    state: { report: rowData },
                  }),
              },
            ]}
          />
        </Grid>
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
      Loading your account...
    </Grid>
  );
};

export default ScreenAccount;
