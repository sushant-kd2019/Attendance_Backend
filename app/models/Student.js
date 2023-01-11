const mongoose = require("mongoose");

var studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        standard: {
            type: Number,
            required: true,
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model('Student', studentSchema);