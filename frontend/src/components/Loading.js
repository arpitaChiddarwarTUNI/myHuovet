import React from "react";
import { Stack, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Stack
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        sx={{
          color: "white",
        }}
      ></CircularProgress>
    </Stack>
  );
}
