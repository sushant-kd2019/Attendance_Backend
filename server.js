const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.set('strictQuery', false)

const app = express();
const dbConfig = require("./app/config/config");
var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

const StudentRoutes = require('./app/routes/Student.routes');
const SubjectRoutes = require('./app/routes/Subject.routes');
const EnrollmentRoutes = require('./app/routes/Enrollment.routes');
const AttendanceRoutes = require('./app/routes/Attendance.routes');

app.use('/', StudentRoutes, SubjectRoutes, EnrollmentRoutes, AttendanceRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});