import { Button, Card, CardHeader, Collapse, IconButton } from "@mui/material";
import { Box } from "@mui/system";

import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import SingleMedicine from "./SingleMedicine";

const Medicine = ({ open }) => {
  const [medicineOpen, setMedicineOpen] = useState(false);
  const [showNewMedicine, setShowNewMedicine] = useState(false);
  const appointments = useSelector((state) => state.appointments);
  useEffect(() => {
    setMedicineOpen(open);
  }, [open]);

  const handleNewMedicine = (open) => {
    setShowNewMedicine(open);
  };

  // useEffect(() => {
  //   console.log(appointments.singleAppointment.prescriptions);
  // }, [appointments]);

  return (
    <Box>
      <Card>
        <CardHeader
          title="Reseptilääkkeet"
          onClick={() => setMedicineOpen(!medicineOpen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{color: "white"}}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={medicineOpen} sx={{ paddingX: 2 }}>
          {appointments.singleAppointment.prescriptions.map((med, index) => (
            <SingleMedicine
              singleMedicine={med}
              closeMedicine={handleNewMedicine}
              key={index}
            ></SingleMedicine>
          ))}
          {showNewMedicine && (
            <SingleMedicine closeMedicine={handleNewMedicine}></SingleMedicine>
          )}
          <Box align={"center"} sx={{ padding: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleNewMedicine(true)}
              color="third"
            >
              Lisää lääke
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Medicine;
