import { Button, Card, CardHeader, Collapse, IconButton } from "@mui/material";
import { Box } from "@mui/system";

import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SingleDiagnose from "./SingleDiagnose";
import { useSelector } from "react-redux";

const Diagnosis = ({ open }) => {
  const [diagnoseopen, setDiagnoseopen] = useState(false);
  const [showNewDiagnose, setShowNewDiagnose] = useState(false);
  const appointments = useSelector((state) => state.appointments);
  useEffect(() => {
    setDiagnoseopen(open);
  }, [open]);

  const handleNewDiagnose = (open) => {
    setShowNewDiagnose(open);
  };
  return (
    <Box>
      <Card>
        <CardHeader
          title="Diagnoosi"
          onClick={() => setDiagnoseopen(!diagnoseopen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{ color: "white" }}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={diagnoseopen} sx={{ paddingX: 2 }}>
          {appointments.singleAppointment.diagnosis.map((diagnose, index) => (
            <SingleDiagnose
              singleDiagnose={diagnose}
              closeDiagnose={handleNewDiagnose}
              key={index}
            ></SingleDiagnose>
          ))}

          {showNewDiagnose && (
            <SingleDiagnose closeDiagnose={handleNewDiagnose}></SingleDiagnose>
          )}
          <Box align={"center"} sx={{ padding: 2 }}>
            <Button
              variant="contained"
              size="large"
              color="third"
              startIcon={<AddIcon />}
              onClick={() => handleNewDiagnose(true)}
            >
              Lisää diagnoosi
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Diagnosis;
