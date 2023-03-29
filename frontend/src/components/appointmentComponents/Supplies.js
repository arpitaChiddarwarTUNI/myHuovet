import { Button, Card, CardHeader, Collapse, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import SingleSupply from "./SingleSupply";
const Supplies = ({ open }) => {
  const [supplyopen, setSupplyopen] = useState(false);
  const [showNewSupply, setShowNewSupply] = useState(false);
  const appointments = useSelector((state) => state.appointments);
  useEffect(() => {
    setSupplyopen(open);
  }, [open]);

  const handleNewSupply = (open) => {
    setShowNewSupply(open);
  };
  return (
    <Box>
      <Card>
        <CardHeader
          title="Käytetyt tarvikkeet"
          onClick={() => setSupplyopen(!supplyopen)}
          sx={{ color: "white" }}
          titleTypographyProps={{ variant: "h6" }}
          action={
            <IconButton sx={{color: "white"}}>
              <ExpandMoreIcon />
            </IconButton>
          }
        />
        <Collapse in={supplyopen} sx={{ paddingX: 2 }}>
          {appointments.singleAppointment.useds.map((supply, index) => (
            <SingleSupply
              singleSupply={supply}
              closeSupply={handleNewSupply}
              key={index}
            ></SingleSupply>
          ))}
          {showNewSupply && (
            <SingleSupply closeSupply={handleNewSupply}></SingleSupply>
          )}
          <Box align={"center"} sx={{ padding: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleNewSupply(true)}
              color="third"
            >
              Lisää tarvike
            </Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
};

export default Supplies;
