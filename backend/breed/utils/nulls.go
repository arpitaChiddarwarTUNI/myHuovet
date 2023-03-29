package utils

import (
	"database/sql"
)

// Change string to NullString
func NewNullString(s string) sql.NullString {
    if len(s) == 0 {
        return sql.NullString{}
    }
    return sql.NullString{
         String: s,
         Valid: true,
    }
}


// Change Int64 to NullInt64
func NewNullInt64(s int64) sql.NullInt64 {
    if s == 0 {
        return sql.NullInt64{}
    }
    return sql.NullInt64{
         Int64: s,
         Valid: true,
    }
}
