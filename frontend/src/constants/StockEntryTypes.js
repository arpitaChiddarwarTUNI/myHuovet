
export const StockEntryTypes = {
    TYPE_ADD : 1,
    TYPE_USE : 2,
    TYPE_LOSS : 3,
    TYPE_MEASUREMENT_LOSS : 4,
    TYPE_OTHER : 5,
    TYPE_INVENTORY : 6
}

export const GetStockEntryTypes = (code) => {
    switch (code){
        case StockEntryTypes.TYPE_ADD:
            return "Add";
        case StockEntryTypes.TYPE_USE:
            return "Use";
        case StockEntryTypes.TYPE_LOSS:
            return "Loss";
        case StockEntryTypes.TYPE_MEASUREMENT_LOSS:
            return "Measurement Loss";
        case StockEntryTypes.TYPE_OTHER:
            return "Other";
        case StockEntryTypes.TYPE_INVENTORY:
            return "Inventory";
        default:
            break;
    }
}