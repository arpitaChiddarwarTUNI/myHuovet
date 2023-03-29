export const ItemTypes = {
    ITEM_TYPE_PROCEDURE : 1,
    ITEM_TYPE_MEDICINE : 2,
    ITEM_TYPE_SUPPLY : 3,
    ITEM_TYPE_FOOD : 4,
    ITEM_TYPE_LABORATORY_ANALYSIS : 5,
    ITEM_TYPE_LABORATORY_ANALYSIS_PANEL : 6
}

export const GetItemTypes = (code) => {
    switch (code){
        case ItemTypes.ITEM_TYPE_PROCEDURE:
            return "Procedures";
        case ItemTypes.ITEM_TYPE_MEDICINE:
            return "Medicines";
        case ItemTypes.ITEM_TYPE_SUPPLY:
            return "Supplies";
        case ItemTypes.ITEM_TYPE_FOOD:
            return "Food";
        case ItemTypes.ITEM_TYPE_LABORATORY_ANALYSIS:
            return "Laboratory Analysis";
        case ItemTypes.ITEM_TYPE_LABORATORY_ANALYSIS_PANEL:
            return "Laboratory Analysis Panel";
        default:
            break;
    }
}