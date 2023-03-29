import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import ManageStockBatches from "./ManageStockBatches";
import ManageStockLevels from "./ManageStockLevels";
import { fetchItems } from '../store/features/itemSlice';
import {useDispatch, useSelector} from "react-redux";

const ManageStocks = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.items);
    dispatch(fetchItems());

  return (
    <Box>
      <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
        Stock Items / Stock Levels
      </Typography>
      {/*  Stock Items*/}
      <ManageStockLevels items={items} />

        <br/>

      {/*  Batches */}
      <Typography variant="h5" color="white" sx={{ marginBottom: 3 }}>
        Stock Batches
      </Typography>
      <ManageStockBatches items={items} />
    </Box>
  );
};

export default ManageStocks;