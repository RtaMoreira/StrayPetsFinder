import React, { useState  } from "react";
import MaterialTable , {MTableToolbar }from "material-table";
import TableIcons from "../assets/TableIcons";

import DialogDetail from "./DialogDetail";

const ListOfReports = (props) => {
  const [dialog, setDialog] = useState({ open: false, report: null });

  //for Dialog box containing report details
  const handleClickOpen = (report) => {
    setDialog({ open: true, report: report });
  };

  const handleClose = (report) => {
    setDialog({ open: true, report: null });
  };

  return (
    <div>
      <MaterialTable
        icons={TableIcons}
        columns={[
          {
            title: " ",
            field: "imageUrl",
            sorting: false,
            render: (rowData) => (
              <img
              alt={"image of"+rowData.petName+" for report published on "+rowData.date}
                src={rowData.imageUrl}
                style={{ width: 150, borderRadius: "2%" }}
              />
            ),
          },
          { title: "Date", field: "date", type: "date" },
          {
            title: "Distance from you",
            field: "distanceFromPosition",
            render: (rowData) => (rowData.distanceFromPosition+" km"
            ),
            hidden: props.manualLocation?true:false
          },
          { title: "Nom", field: "petName" ,sorting: false},
          { title: "Status", field: "status" },
          {title: "Animal",field: "animal"},
          { title: "Location", field: "location", sorting: false }


        ]}
        data={props.reports}
        title="All current reports"
        onRowClick={(event, rowData) => handleClickOpen(rowData)}
          components={{
            Toolbar: props => (
              <div>
                <MTableToolbar {...props} />
                
              </div>
            ),
          }}
      />
      {dialog.report ? ( //Show dialog when it's selected
        <DialogDetail
          report={dialog.report}
          handleClose={handleClose}
          dialog={dialog}
        />
      ) : null}{" "}
    </div>
  );
};

export default ListOfReports;
