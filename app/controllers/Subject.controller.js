const { ObjectId } = require('bson');
var SubjectDb = require('../models/Subject');
const util = require('../util');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({message: "Content cannot be empty."});
        return;
    }

    const subject = new SubjectDb({
        name: req.body.name,
    });

    subject
        .save(subject)
        .then((data) => {
            res.status(200).send({message: "Subject saved successfully."});
            console.log("Subject saved.");
        })
        .catch((err) => {
            res.status(500).send({message: err.message});
        });
}

exports.find = (req, res) => {
    let query = {};
    let sort_by = "name";
    let sort_order = 1;

    if (req.query.name) {
        query.name = {$regex: `(?i).*${req.query.name}.*`};
    }

    meta_data = util.paginate(req.query.page, req.query.per_page);

    SubjectDb.find(query).sort({[sort_by]: sort_order}).exec()
        .then(async (data) => {
            if (data.length==0){
                res.status(404).send({message: "No subjects found."});
            } else {
                let response = await util.process_mongo_data(SubjectDb, query, data, meta_data);
                res.send(response);
            }
        })
        .catch((err) => {
            res.status(500).send({message: err.message});
        });
}