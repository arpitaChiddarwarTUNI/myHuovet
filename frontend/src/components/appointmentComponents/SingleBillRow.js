import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyBill } from "../../store/features/billSlice";

export function SingleServiceRow({singleService }) {  
  const [serviceprice, setServiceprice] = useState(0);
  const dispatch = useDispatch();
  const bill = useSelector((state) => state.bills);

  const handleServicePriceChange = (event) => {
    setServiceprice(event.target.value);
    handleSave();
  };

  const handleSave = () => {
    const billObject = {
      appointment_id: bill.singleBill.appointment_id,
      bill_number: bill.singleBill.bill_number,
      due_date: bill.singleBill.due_date,
      examinations: bill.singleBill.examinations,
      paid: bill.singleBill.paid,
      service_price: serviceprice,
      supplies: bill.singleBill.supplies,
    };
    dispatch(modifyBill(billObject));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <Typography>Käyntimaksu</Typography>
      {singleService ? (
        <TextField onChange={handleServicePriceChange}>
          {singleService.service_price}
        </TextField>) : (
        <TextField onChange={handleServicePriceChange}>
        </TextField>
      )}
    </Box>
  );
}

export function SingleExamRow({singleExam}) {
  const [examid, setExamid] = useState("");  
  const [examprice, setExamprice] = useState(0);
  const bill = useSelector((state) => state.bills);
  const dispatch = useDispatch();
  const examList = [{ name: "exam 1", id: 4 }];

  if (singleExam) {
    setExamid(singleExam.examination_type_id);
    setExamprice(singleExam.price);
  }

  const handleSave = () => {
    if (examid.length > 0 && parseFloat(examprice) > 0) {
      const examObject = {
        examination_type_id: examid,
        price: parseFloat(examprice), 
      }
      let examArray = bill.singleBill.examination.map(
        (item) => {
          return {
            examination_type_id: item.examination_type_id,
            price: item.price,
          };
        }
      );
      let filteredexamArray = examArray.filter(function (el) {
        return el.examination_type_id != examid;
      });
      filteredexamArray.push(examObject);

      const billObject = {
        appointment_id: bill.singleBill.appointment_id,
        bill_number: bill.singleBill.bill_number,
        due_date: bill.singleBill.due_date,
        examinations: filteredexamArray,
        paid: bill.singleBill.paid,
        service_price: bill.singleBill.service_price,
        supplies: bill.singleBill.supplies,
      };
      dispatch(modifyBill(billObject));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
    {singleExam ? (
      <>
        <Typography>{singleExam.name}</Typography>        
        <TextField
          fullWidth
          required
          variant="filled"
          onChange={(e) => {setExamprice(e.target.value); handleSave();}}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          >{singleExam.price}</TextField>
      </>
    ) : (
      <>
        <FormControl fullWidth>
          <InputLabel variant="filled" required>
          Tutkimus
          </InputLabel>
          <Select
            variant="filled"
            onChange={(e) => {setExamid(e.target.value); handleSave();}}
            id="examType"
            style={{ backgroundColor: "#f0f0f0" }}
            sx={{
              borderRadius: 1,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#f0f0f0",
                  color: "black",
                },
              },
            }}
          >
            {examList.map((ex) => {
              return (
                <MenuItem key={ex.id} value={ex.id}>
                  {ex.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>        
        <TextField
          fullWidth
          required
          variant="filled"
          onChange={(e) => {setExamprice(e.target.value); handleSave();}}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          ></TextField>
      </>
    )}      
    </Box>
  );
}

export function SingleSupplyRow({singleSupply}) {

  const [supplyid, setSupplyid] = useState("");
  const [supplyamount, setSupplyamount] = useState(0);
  const [supplyprice, setSupplyprice] = useState(0);
  const bill = useSelector((state) => state.bills);
  const dispatch = useDispatch();
  const supplyList = [{ name: "supply 1", id: 4 }];

  if (singleSupply) {
    setSupplyid(singleSupply.supplies_id);
    setSupplyamount(singleSupply.amount)
    setSupplyprice(singleSupply.price);
  }

  const handleSave = () => {
    if (supplyid.length > 0 && parseFloat(supplyprice) > 0 && parseInt(supplyamount) > 0) {
      const supplyObject = {
        supplies_id: supplyid,
        amount: parseInt(supplyamount),
        price: parseFloat(supplyprice), 
      }
      let supplyArray = bill.singleBill.supplies.map(
        (item) => {
          return {
            supplies_id: item.supplies_id,
            amount: item.amount,
            price: item.price,
          };
        }
      );
      let filteredsupplyArray = supplyArray.filter(function (el) {
        return el.supplies_id != supplyid;
      });
      filteredsupplyArray.push(supplyObject);

      const billObject = {
        appointment_id: bill.singleBill.appointment_id,
        bill_number: bill.singleBill.bill_number,
        due_date: bill.singleBill.due_date,
        examinations: bill.singleBill.examinations,
        paid: bill.singleBill.paid,
        service_price: bill.singleBill.service_price,
        supplies: filteredsupplyArray,
      };
      dispatch(modifyBill(billObject));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
    {singleSupply ? (
      <>
        <Typography>{singleSupply.name}</Typography>
        <TextField
          fullWidth
          required
          variant="filled"
          onChange={(e) => {setSupplyamount(e.target.value); handleSave();}}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          >{singleSupply.amount}</TextField>
        <TextField
          fullWidth
          required
          variant="filled"
          onChange={(e) => {setSupplyprice(e.target.value); handleSave();}}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          >{singleSupply.price}</TextField>
      </>
    ) : (
      <>
        <FormControl fullWidth>
          <InputLabel variant="filled" required>
          Tutkimus
          </InputLabel>
          <Select
            variant="filled"
            onChange={(e) => {setSupplyid(e.target.value); handleSave();}}
            id="examType"
            style={{ backgroundColor: "#f0f0f0" }}
            sx={{
              borderRadius: 1,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#f0f0f0",
                  color: "black",
                },
              },
            }}
          >
            {supplyList.map((sup) => {
              return (
                <MenuItem key={sup.id} value={sup.id}>
                  {sup.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          required
          variant="filled"
          onChange={(e) => {setSupplyamount(e.target.value); handleSave();}}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          ></TextField>
        <TextField
          fullWidth
          required
          variant="filled"
          onChange={(e) => {setSupplyprice(e.target.value); handleSave();}}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
          ></TextField>
      </>
    )}  
    </Box>
  );
}