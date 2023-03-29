import { Box } from "@mui/system";
import { Typography, Grid, Tabs, Tab } from "@mui/material";
import {useState} from "react";
import ManageStaff from "./ManageStaff";
import ManageMedicines from "./ManageMedicines";
import ManageTreatments from "./ManageTreatments";
import ManageSupplies from "./ManageSupplies";
import ManageAppointmentType from "./ManageAppointmentType";
import ManageExamination from "./ManageExamination";
import ManageDiagnoseType from "./ManageDiagnoseType";
import ManageSpecies from "./ManageSpecies";
import ManageItems from "./ManageItems";
import ManageStocks from "./ManageStocks";
import ManageWholesalers from "./ManageWholesalers";
import ManageDepartment from "./ManageDepartment";
import ManageVatGroups from "./ManageVatGroups";

const Management = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Grid
      container
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 5,
        marginX: 1,
        "@media (max-width: 600px)": 
        {
          marginLeft:0
        },
        marginBottom: 5
      }}
    >
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "primary.main",
        }}
      >
        <Typography variant="h5" color="white">
          Lisää, muokkaa tai poista tietoja
        </Typography>
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "left",
        }}
      >
        <Grid item xs={12} sm={3}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabIndex}
            onChange={handleTabChange}
            sx={{
              borderRight: 1,
              borderColor: "divider",
              backgroundColor: "secondary.main",
              marginTop: 5,
              marginRight: 5,
              marginLeft: 1,
              maxWidth: 400,
              "& .MuiTabs-indicator": { backgroundColor: "primary.main" },
              "& .MuiTab-root": { color: "#FFFFFF" },
              "& .Mui-selected": { color: "primary.main" },
              "@media (max-width: 600px)": 
                {
                  marginRight: 1,
                  marginLeft: 1,
                  maxWidth: 600,
                  alignItems:"center",
                  borderRadius:"1%"
                }
            }}
          >
            <Tab label="Lajit ja rodut" id="species_and_breeds" />
            <Tab label="Henkilökunta" id="staff" />
            <Tab label="Käyntityypit" id="appointment_types" />
            <Tab label="Mittaukset ja tutkimukset" id="examinations" />
            <Tab label="Diagnoosit" id="diagnosis" />
            <Tab label="Toimenpiteet" id="treatments" />
            <Tab label="Tarvikkeet" id="supplies" />
            <Tab label="Lääkkeet" id="medicines" />
            <Tab label="Items" id="items" />
            <Tab label="Stocks" id="stocks" />
            <Tab label="Wholesalers" id="wholesalers" />
            <Tab label="Departments" id="department" />
            <Tab label="VatGroups" id="vatGroups" />
          </Tabs>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={8.5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "secondary.main",
              marginY: 5,
              marginX: 1,
              paddingX: 5,
              paddingY: 4,
              borderRadius: "1%",
              boxShadow: 22,
            }}
          >
            {tabIndex === 0 && <ManageSpecies />}
            {tabIndex === 1 && <ManageStaff />}
            {tabIndex === 2 && <ManageAppointmentType />}
            {tabIndex === 3 && <ManageExamination />}
            {tabIndex === 4 && <ManageDiagnoseType />}
            {tabIndex === 5 && <ManageTreatments />}
            {tabIndex === 6 && <ManageSupplies />}
            {tabIndex === 7 && <ManageMedicines />}
            {tabIndex === 8 && <ManageItems />}
            {tabIndex === 9 && <ManageStocks />}
            {tabIndex === 10 && <ManageWholesalers />}
            {tabIndex === 11 && <ManageDepartment />}
            {tabIndex === 12 && <ManageVatGroups />}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Management;
