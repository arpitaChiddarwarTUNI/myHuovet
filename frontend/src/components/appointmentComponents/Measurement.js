import { Button, Card, CardHeader, Collapse, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import SingleMeasurement from "./SingleMeasurement";

const Measurement = ({ open }) => {
  const [measurementopen, setMeasurementopen] = useState(false);
  const [showNewExam, setShowNewExam] = useState(false);
  const appointments = useSelector((state) => state.appointments);

  const handleNewMeasurement = (open) => {
    setShowNewExam(open);
  };

  useEffect(() => {
    setMeasurementopen(open);
  }, [open]);

  return (
    <Box>
      <Card>
        <CardHeader
          title="Mittaukset ja tutkimukset"
          onClick={() => setMeasurementopen(!measurementopen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{color: "white"}}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={measurementopen} sx={{ paddingX: 2 }}>
          {appointments.singleAppointment.examinations.map(
            (examination, index) => (
              <SingleMeasurement
                examination={examination}
                closeMeasurement={handleNewMeasurement}
                key={index}
              ></SingleMeasurement>
            )
          )}
          {showNewExam && (
            <SingleMeasurement
              closeMeasurement={handleNewMeasurement}
            ></SingleMeasurement>
          )}
          <Box align={"center"} sx={{ padding: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleNewMeasurement(true)}
              color="third"
            >
              Lisää tutkimus
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Measurement;
