import {
  Button,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import { Box } from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { billedAppointment } from "../../store/features/appointmentsSlice";
import PrintIcon from "@mui/icons-material/Print";
import { modifyBill } from "../../store/features/billSlice";

const ExistingBill = () => {
  const bills = useSelector((state) => state.bill);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handlePrint = () => {
    navigate(`/invoice`);
  };

  const handleMakePaid = () => {
    const paidBill = { ...bills.singleBill, paid: true };
    dispatch(modifyBill(paidBill));
  };
  return (
    <>
      <Box>
        <Typography variant="h6" color="white">
          Lasku
        </Typography>
        <TableContainer>
          <Table>
            <TableHead></TableHead>
            <TableBody></TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Button
            startIcon={<PrintIcon />}
            onClick={() => handlePrint()}
            size="large"
            variant="contained"
            color="info"
          >
            Avaa tulostettava lasku
          </Button>
          <Button
            type="submit"
            startIcon={<CheckIcon />}
            variant="contained"
            size="large"
            color="success"
            sx={{ ml: 3 }}
            onClick={() => handleMakePaid()}
            disabled={bills.singleBill.paid}
          >
            Merkitse maksetuksi
          </Button>
        </Box>
      </Box>
      {bills.singleBill.paid && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 3,
            marginTop: 1,
          }}
        >
          <Typography variant="subtitle1" color="white">
            Lasku on maksettu
          </Typography>
        </Box>
      )}
    </>
  );
};
export default ExistingBill;
