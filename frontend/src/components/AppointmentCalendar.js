import React, { useState, useEffect } from "react";
import {
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import { Box, Grid } from "@mui/material";
import "./CalendarStyles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const appointments = useSelector((state) => state.appointments);
  const [currentDate, setCurrentDate] = useState();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const calendarArray = appointments.appointments.map(
      ({ id, starting_date, ending_date }) => ({
        id,
        backColor: "coral",
        start: starting_date.toString().replace(/ /g, "T"),
        end: ending_date.String.toString().replace(/ /g, "T"),
        text: "testi",
      })
    );
    setEvents(calendarArray);
  }, [appointments]);

  return (
    <>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          md={2.5}
          lg={2}
          xl={1.5}
          justifyContent="center"
          sx={{ backgroundColor: "none" }}
          p={1}
        >
          <Grid
            container
            justifyContent="center"
            sx={{
              direction: "column",
            }}
          >
            <Box sx={{ boxShadow: 10 }}>
              <DayPilotNavigator
                selectMode={"week"}
                locale={"fi-fi"}
                onTimeRangeSelected={(selectedDate) => {
                  setCurrentDate(selectedDate.day.value);
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} md={9.5} lg={10} xl={10.5} p={1}>
          <Box sx={{ boxShadow: 10 }}>
            <DayPilotCalendar
              viewType={"WorkWeek"}
              startDate={currentDate}
              events={events}
              locale={"fi-fi"}
              headerDateFormat={"ddd d.M.yyyy"}
              businessBeginsHour={8}
              dayBeginsHour={8}
              dayEndsHour={17}
              timeRangeSelectedHandling={"Enabled"}
              eventMoveHandling={"Disabled"}
              eventResizeHandling={"Disabled"}
              weekends={"Disabled"}
              eventClickHandling={"Enabled"}
              durationBarVisible={false}
              onEventClicked={(args) => {
                //console.log(args.e.data.id);
                navigate("/appointment/" + args.e.data.id);
              }}
              onTimeRangeSelected={(args) => {
                const dp = args.control;
                dp.clearSelection();
                navigate("/new-appointment/" + args.start.value);
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AppointmentCalendar;
