import { Button, Card, CardHeader, Collapse, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import SingleOperation from "./SingleOperation";

const Operations = ({ open }) => {
  const [measureopen, setMeasureopen] = useState(false);
  const [showNewOperation, setShowNewOperation] = useState(false);
  const appointments = useSelector((state) => state.appointments);
  const handleNewOperation = (open) => {
    setShowNewOperation(open);
  };
  useEffect(() => {
    setMeasureopen(open);
  }, [open]);

  return (
    <Box>
      <Card>
        <CardHeader
          title="Toimenpiteet"
          onClick={() => setMeasureopen(!measureopen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{color: "white"}}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={measureopen} sx={{ paddingX: 2 }}>
          {appointments.singleAppointment.operations.map((operation, index) => (
            <SingleOperation
              operation={operation}
              closeOperation={handleNewOperation}
              key={index}
            ></SingleOperation>
          ))}
          {showNewOperation && (
            <SingleOperation
              closeOperation={handleNewOperation}
            ></SingleOperation>
          )}
          <Box align={"center"} sx={{ padding: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleNewOperation(true)}
              color="third"
            >
              Lisää toimenpide
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Operations;
