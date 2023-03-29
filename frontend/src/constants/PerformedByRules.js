export const PerformedByRules = {
    PERFORMED_BY_INHERIT : 0,
    PERFORMED_BY_REQUIRED : 1,
    PERFORMED_BY_NOT_REQUIRED : 2,
}

export const GetPerformedByRules = (code) => {
    switch (code){
        case ItemTypes.PERFORMED_BY_INHERIT:
            return "Inherit";
        case ItemTypes.PERFORMED_BY_REQUIRED:
            return "Required";
        case ItemTypes.PERFORMED_BY_NOT_REQUIRED:
            return "Not Required";
        default:
            break;
    }
}