const { ObjectId } = require('bson');
var StudentDb = require('../models/Student')
const util = require('../util');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({message: "Content cannot be empty."});
        return;
    }

    const student = new StudentDb({
        name: req.body.name,
        standard: req.body.standard,
    });

    student
        .save(student)
        .then((data) => {
            res.status(200).send({message: "Student saved successfully."});
            console.log("Student saved.");
        })
        .catch((err) => {
            res.status(500).send({message: err.message});
        });
}

exports.getStudents = (req, res) => {
    let query = {};
    let sort_by = "name";
    let sort_order = 1;
    
    if (req.query.name) {
        query.name = {$regex: `(?i).*${req.query.name}.*`};
    }
    if (req.query.standard) {
        query.standard = req.query.standard;
    }
    if (req.query.sort_by) {
        sort_by = req.query.sort_by;
    }
    if (req.query.sort_order==="DESC") {
        sort_order = -1;
    }

    meta_data = util.paginate(req.query.page, req.query.per_page);

    StudentDb.find(query).sort({[sort_by]: sort_order}).exec()
        .then( async (data) => {
            if (data.length==0) {
                res.status(404).send({
                    message: "No results found or page number exceeded."
                })
            } else {     
                let response = await util.process_mongo_data(StudentDb, query, data, meta_data);
                res.send(response);
            }
        })
        .catch ((err) => {
            res.status(500).send({message: err});
        })
}