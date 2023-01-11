const mongoose = require("mongoose");
const { Schema } = mongoose;


var enrollmentSchema = new Schema(
    {
        student_id:{
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        subject_name: {
            type: String,
            ref: "Subject",
            required: true
        },
        enrolled: {
            type: Boolean,
            required: true,
            default: false    
        }
    },
    {timestamps: true}
)
module.exports = mongoose.model('Enrollment', enrollmentSchema);