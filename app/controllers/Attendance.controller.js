const { ObjectId } = require('bson');
const { response } = require('express');
const moment = require('moment');
var AttendanceDb = require('../models/Attendance')
var StudentDb = require('../models/Student')
var SubjectDb = require('../models/Subject')
var EnrollmentDb = require('../models/Enrollment')
const util = require('../util');

exports.create = async (req, res) => {
    if (req.body) {
        if (req.body.student_id) {
            let student_id = req.body.student_id;

            if (req.body.subject_name){
                let subject_name = req.body.subject_name;
                if (ObjectId.isValid(student_id)) {
                    var student = await StudentDb.find({_id: ObjectId(student_id)});
    
                    if (student) {
                        var subject = await SubjectDb.find({name: subject_name});
    
                        if (subject) {
                            if (req.body.date) {
                                date = req.body.date;
                                if (moment(date,'YYYY/MM/DD',true).isValid()) {
                                    console.log(date);
                                    let iso_date = new Date(date);
                                    console.log(iso_date);
                                    
                                    enrollment_exists = await EnrollmentDb.find({
                                        student_id: ObjectId(student_id),
                                        subject_name: subject_name
                                    })
                                    if (enrollment_exists.length>0){
    
                                        AttendanceDb.findOneAndUpdate(
                                            {
                                                student_id: ObjectId(student_id),
                                                subject_name: subject_name,
                                                date: iso_date,    
                                            },
                                            {
                                                student_id: ObjectId(student_id),
                                                subject_name: subject_name,
                                                date: iso_date,
                                                status: req.body.status?req.body.status:"present"    
                                            },
                                            {
                                                upsert: true,
                                                new: true,
                                                setDefaultsOnInsert: true                                        
                                            }
                                        ).then(()=> {
                                            res.status(200).send({message: "Attendance marked."});
                                            console.log("Attendance marked.");
                                    })
                                        .catch((err) => {
                                            res.status(500).send({message: err.message});
                                        });
                                    } else {
                                        res.status('400').send({message:"student not enrolled in the subject."})
                                    }
                                } else {
                                    res.status('400').send({message:"date format should be YYYY/MM/DD."})
                                }
                            } else {
                                res.status('400').send({message:"date not given. Provide in YYYY/MM/DD format."})
                            }
                        } else {
                            res.status('404').send({message:"subject not found."})
                        }
                    } else {
                        res.status('404').send({message:"student does not exist."})
                    }
                } else {
                    res.status('400').send({message:"student_id is invalid."})
                }
            } else {
                res.status('400').send({message:"subject_name must be present in the body."})
            }
        } else {
            res.status('400').send({message:"student_id must be present in the body."})
        }
    }
}


exports.find = async (req, res) => {
    let student_id = req.params.student_id;
    let subject_name = req.query.subject_name;
    let sort_by = "date";
    let sort_order = -1;

    if (req.query.sort_by) {
        sort_by = req.query.sort_by;
    }
    if (req.query.sort_order==="ASC") {
        sort_order = -1;
    }    

    let query = {};
    if (ObjectId.isValid(student_id)) {
            let student = await StudentDb.find({_id: ObjectId(student_id)});
    
            if (student.length>0) {
                query["student_id"] = ObjectId(student_id);
                if (subject_name) {
                    let subject = await SubjectDb.find({name: subject_name});
                    if (subject.length>0) {
                        query["subject_name"] = subject_name;
                    }

                    start_date = req.query.start_date;
                    end_date = req.query.end_date;
                    let new_date = new Date();
                    console.log(new_date);
                    let start_iso_date = new Date(new_date.getFullYear()-1, new_date.getMonth(), new_date.getDate());
                    let end_iso_date = new Date(new_date.getFullYear(), new_date.getMonth(), new_date.getDate());
                    console.log(end_iso_date)

                    if (moment(start_date,'YYYY/MM/DD',true).isValid()) {
                        console.log(start_date);
                        start_iso_date = new Date(start_date);
                    }
                    if (moment(end_date,'YYYY/MM/DD',true).isValid()) {
                        end_iso_date = new Date(end_date);
                    }

                    query["date"] = {"$gte": start_iso_date, "$lte": end_iso_date};

                    if (req.query.status) {
                        query["status"] = req.query.status;
                    }

                    meta_data = util.paginate(req.query.page, req.query.per_page);
                    console.log(meta_data);
                    console.log(query);
                    AttendanceDb.find(query).sort({[sort_by]: sort_order}).exec()
                        .then( async (data) => {
                            if (data.length==0) {
                                res.status(404).send({
                                    message: "No results found or page number exceeded."
                                })
                            } else {     
                                let response = await util.process_mongo_data(AttendanceDb, query, data, meta_data);
                                res.send(response);
                            }
                        })
                        .catch ((err) => {
                            console.log(err);
                            res.status(500).send({message: err});
                        })

                } else {
                    res.status(400).send({message:"subject_name must be present."})
                }
            } else {
                res.status(404).send({message: "student with the given id does not exist."})
            }
    } else {
        res.status(400).send({message:"student_id is invalid."})
    }
}