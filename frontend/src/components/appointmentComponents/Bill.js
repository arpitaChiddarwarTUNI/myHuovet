import { useSelector } from "react-redux";
import NewBill from "../billComponents/NewBill";
import ExistingBill from "../billComponents/ExistingBill";

const Bill = () => {
  const bills = useSelector((state) => state.bill);

  return (
    <>
      {bills.singleBill.bill_number == "" ? (
        <NewBill></NewBill>
      ) : (
        <ExistingBill></ExistingBill>
      )}
    </>
  );
};
export default Bill;
