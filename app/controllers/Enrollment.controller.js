const { ObjectId } = require('bson');
const EnrollmentDb  = require('../models/Enrollment');
const StudentDb = require('../models/Student');
const SubjectDb = require('../models/Subject');
const util = require('../util');

exports.create = async (req, res) => {
    let subject_name = req.body.subject_name;
    let student_id = req.body.student_id;
    console.log(student_id);

    if (ObjectId.isValid(student_id)) {
        var student = await StudentDb.find({_id: ObjectId(student_id)});
        if (student) {
            var subject = await SubjectDb.find({name: subject_name});
            if (subject) {
                let existing = await EnrollmentDb.find({student_id: ObjectId(student_id), subject_name: subject_name});
                if (existing.length===0){
                    let enrollment = new EnrollmentDb({
                        student_id: ObjectId(student_id),
                        subject_name: subject_name,
                    });
                    enrollment
                        .save(enrollment)
                        .then((data) => {
                            res.status(200).send({message: "Enrolled."});
                            console.log("enrolled");
                        })
                        .catch((err) => {
                            res.status(500).send({message: err.message});
                        })
                } else {
                    res.status(403).send({message: "Already enrolled."});
                }
            } else {
                res.status(400).send({message:"The subject with the given name does not exist."})
            }
        } else {
            res.status(400).send({message: "student with the given id does not exist."});
        }
    } else {
        res.status(400).send({message: "The student_id given is invalid."})
    }

}