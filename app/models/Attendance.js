const mongoose = require("mongoose");
// const attendance_states = {"p":"present","a": "absent","nw": "non_working_day"};


var attendanceSchema = new mongoose.Schema(
    {
        student_id:{
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        subject_name: {
            type: String,
            ref: "Subject",
            required: true,
        },
        date: Date,
        status: String,
    },
    {timestamps: true}
)

module.exports = mongoose.model('Attendance', attendanceSchema)