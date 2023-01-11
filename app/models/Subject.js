const mongoose = require("mongoose");

var subjectSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model('Subject', subjectSchema);