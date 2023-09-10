import React from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import dayjs, { Dayjs } from "dayjs";
import { Grid, Paper, Container } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import axios from "../api/axios";
import "../css/book.css";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Bookslot = () => {
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [timeslot, setTimeslot] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  function formatTime(time24: string) {
    const [hours, minutes] = time24.split(":");
    const parsedHours = parseInt(hours, 10);

    let period = "AM";
    let formattedHours = parsedHours;

    if (parsedHours === 0) {
      formattedHours = 12;
    } else if (parsedHours >= 12) {
      period = "PM";
      if (parsedHours > 12) {
        formattedHours = parsedHours - 12;
      }
    }
    let startTime = `${formattedHours}:${minutes} ${period}`;
    let [time, period1] = startTime.split(" ");
    let [hours1, minutes1] = time.split(":");

    let newHours = parseInt(hours1, 10) + 1;
    if (newHours === 12) {
      if (period1 === "AM") {
        period1 = "PM";
      } else {
        period1 = "AM";
      }
    }
    if (newHours > 12) {
      newHours -= 12;
      period1 = period1 === "AM" ? "PM" : "AM";
    }
    return `${formattedHours}:${minutes} ${period} to ${newHours}:${minutes1} ${period1}`;
  }

  const bookAppointment = async (i: number) => {
    const newTime = timeslot[i];
    const selectedDate = value?.format("YYYY-MM-DD");
    // console.log(timeslot);
    // console.log(selectedDate, newTime);
    let flag=0;
    if(timeslot.length===1) flag=1;
    try {
      const response = await axios.post(
        "/slots/bookslot",
        JSON.stringify({
          email: sessionStorage.getItem("email"),
          date: selectedDate,
          timeslot: newTime,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      let newTimeSlots = timeslot.filter((timed) => {
        return timed !== newTime;
      });

    //   if(newTimeSlots.length===0) setFirst(true);
    //   else setFirst(false);
      if(flag) setSecond(true);
      setTimeslot(newTimeSlots);
      setOpen(true);

    //   console.log("Booked successfully");
    } catch (error) {
        setSecond(true);
        console.log("Verification error: ", error);
    }
  };

  const getTimeSlots = async () => {
    // Here, newValue will be the selected date.
    setFirst(false);
    const selectedDate = value?.format("YYYY-MM-DD");
    try {
      const response = await axios.get(`/slots/${selectedDate}`);
      const times = response.data;
      console.log(times);
      if(times.length===0){
        setSecond(true);
        setFirst(false);
      }
      else{
        setSecond(false);
      }
      setTimeslot(times);
    } catch (error) {
      setTimeslot([]);
      setSecond(true);
      setFirst(false);
      console.log("Verification error: ", error);
    }
  };

  const disableDates = (date: Dayjs ) => {
    const selectedDate = date.format("YYYY-MM-DD");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    const formattedCurrentDate = `${year}-${month}-${day}`;
    return date ? (selectedDate < formattedCurrentDate) : false;
  };

  return (
    <div className="book">
      <Navbar />
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Slot has been booked!
        </Alert>
      </Snackbar>
      <h2 className="book_title">Book your Appointment</h2>
      <Container style={{ marginTop: "70px" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{
                padding: "10px",
                height: "450px",
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              <Container
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  width: "370px",
                  backgroundColor: "#FCF3DD",
                  borderRadius: "20px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={value}
                    onChange={(newValue) => {setValue(newValue); setFirst(true); setSecond(false); setTimeslot([])}}
                    shouldDisableDate={disableDates}
                  />
                </LocalizationProvider>
              </Container>
              <Container style={{ textAlign: "center" }}>
                <button className="book_button" onClick={getTimeSlots}>
                  Get Time Slots
                </button>
              </Container>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{
                padding: "10px",
                height: "450px",
                overflow: "auto",
                backgroundColor: "#FCF3DD",
                borderRadius: "20px",
              }}
            >
              {timeslot.length === 0 && !first && !second && (
                <div
                  style={{ height: "380px" }}
                  className="d-flex justify-content-center align-items-center"
                >
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              <Container style={{ marginTop: "42px" }}>
                {first && (
                  <div>
                    Click on <b>Get Time slots</b> to get the list of
                    available bookings..
                  </div>
                )}
                {second && <div>Time slots not available for this date...</div>}

                {timeslot.length !== 0 && (
                  <>
                    {timeslot.map((timed, i) => (
                      <>
                        <div
                          style={{
                            borderRadius: "20px",
                            height: "100px",
                            backgroundColor: "#CFD8DA",
                          }}
                          className="card mb-2"
                          key={i + 1}
                        >
                          <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="card-title">
                                {" "}
                                <b>Appointment No. </b> {i + 1}
                              </h5>

                              <p className="card-text">
                                <b>Time: </b> {formatTime(timed)}
                              </p>
                            </div>

                            <button
                              style={{
                                backgroundColor: "#6380EB",
                                color: "white",
                              }}
                              className="btn btn-primary"
                              onClick={() => bookAppointment(i)}
                            >
                              <b>Book</b>
                            </button>
                          </div>
                        </div>
                        <br />
                      </>
                    ))}
                  </>
                )}
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Bookslot;
