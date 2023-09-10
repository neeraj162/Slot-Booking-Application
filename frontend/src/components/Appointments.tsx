import React from "react";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import "../css/appoint.css";
import Swal from "sweetalert2";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Appointments = () => {
  const [fulldata, setFulldata] = useState<any[]>([]);
  const [expiredata, setExpiredata] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [first, setFirst] = useState(false);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.post(
          "/slots/getslots",
          JSON.stringify({ email: sessionStorage.getItem("email") }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = response.data;
        // console.log(data);
        const bookeddata = data.bookedDateTimeslots;
        const nodata = data.expiredDateTimeslots;
        setFulldata(bookeddata);
        setExpiredata(nodata);
        if (bookeddata.length === 0 && nodata.length===0) {
            setFirst(true);
        }
        else if (bookeddata.length === 0 || nodata.length===0) {
            setFirst(false);
        }
      } catch (error) {
        setFirst(true);
        console.log("Verification error: ", error);
      }
    };
    fetchdata();
    // }
  }, []);

  function formatDate(dateString: string) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const [year, month, day] = dateString.split("-");
    const dayInt = parseInt(day, 10);

    let daySuffix;
    if (dayInt === 1 || dayInt === 21 || dayInt === 31) {
      daySuffix = "st";
    } else if (dayInt === 2 || dayInt === 22) {
      daySuffix = "nd";
    } else if (dayInt === 3 || dayInt === 23) {
      daySuffix = "rd";
    } else {
      daySuffix = "th";
    }

    const formattedDate = `${dayInt}${daySuffix} ${
      months[parseInt(month, 10) - 1]
    } ${year}`;
    return formattedDate;
  }
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

  const delConfirm = (id: string, flag: number)=> {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        iconColor: '#FCF3DD',
        showCancelButton: true,
        background: '#cfd8da',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          cancelBooking(id,flag);
        }
      })
  }

  const cancelBooking = async (id: string, flag: number) => {
    // console.log(id);
    try {
      const response = await axios.delete(`/slots/cancel/${id}`);
      let newData = fulldata.filter((userd) => {
        return userd.id !== id;
      });
      let expData = expiredata.filter((userd) => {
        return userd.id !== id;
      });
      if(newData.length===0 && expData.length===0){
        setFirst(true);
      }
      else if (newData.length === 0 || expData.length===0) {
        setFirst(false);
    }
      setFulldata(newData);
      setExpiredata(expData);
      if(flag) setOpen(true);
    } catch (error) {
      console.log("Verification error: ", error);
    }
  };

  return (
    <div className="book">
      <Navbar />
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Slot has been cancelled!
        </Alert>
      </Snackbar>
      <div className="d-flex justify-content-center">
        <div style={{ width: "1000px" }} className="container my-5">
          <h2 className="appoint_title">My Appointments</h2>
          <br />
          <hr className="" />
          <br />
          {first && (
            <div style={{ textAlign: "center" }}>No appointments booked</div>
          )}
          {fulldata.length === 0 && expiredata.length===0 &&  !first && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {fulldata.length !== 0 && (
            <div>
              {fulldata.map((userd, i) => (
                <>
                  <div
                    style={{ borderRadius: "20px", backgroundColor: "#FCF3DD" }}
                    className="card mb-2"
                    key={userd.id}
                  >
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title">
                          {" "}
                          <b>Appointment No. </b> {i + 1}
                        </h5>

                        <p className="card-text">
                          <b>Date: </b> {formatDate(userd.date)}
                          <br />
                          <b>Time: </b> {formatTime(userd.timeslot.startTime)}
                        </p>
                      </div>

                      <button
                        style={{ backgroundColor: "#FF3131", color: "white" }}
                        className="btn btn-danger"
                        onClick={() => delConfirm(userd.id, 1)}
                      >
                        <b>Cancel</b>
                      </button>
                    </div>
                  </div>
                  <br />
                </>
              ))}
            </div>
          )}
          {expiredata.length!==0 && (
            <div>
            {expiredata.map((userd, i) => (
              <>
                <div
                  style={{ borderRadius: "20px", backgroundColor: "#FCF3DD" }}
                  className="card mb-2"
                  key={userd.id}
                >
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 style={{color: 'gray'}} className="card-title">
        
                        <b>Appointment Expired</b>
                      </h5>

                      <p style={{color: 'gray'}} className="card-text">
                        <b>Date: </b> {formatDate(userd.date)}
                        <br />
                        <b>Time: </b> {formatTime(userd.timeslot.startTime)}
                      </p>
                    </div>

                    <button
                      style={{ backgroundColor: "white", color: "gray" }}
                      className="btn btn-light"
                      onClick={() => cancelBooking(userd.id, 0)}
                    >
                      <b>Remove</b>
                    </button>
                  </div>
                </div>
                <br />
              </>
            ))}
          </div>
          )}
        </div>
        


      </div>
    </div>
  );
};

export default Appointments;
