
exports.paginate = (page_val, per_page_val) => {
    let page = 1
    let per_page = 5
    
    if (!isNaN(page_val) && page_val>0) {
        page = page_val;
    }
    if (!isNaN(per_page_val) && per_page_val>0) {
        per_page = per_page_val;
    }
    start_idx = (page - 1) * per_page
    offset = per_page
    return {
        page: page,
        per_page: per_page,
        start_idx: start_idx,
        offset: offset
    }
}

exports.process_mongo_data = async (collectionDb, query, data, meta_data) => {
    data = data.map((obj) => {
        newObj = obj.toJSON();
        newObj.id = newObj._id.toString();
        delete newObj._id;
        delete newObj.__v;
        return newObj;
    });
    data = data.slice(meta_data.start_idx, meta_data.start_idx + meta_data.offset);

    let total_records = 0;
    const record_count = await collectionDb.find(query).countDocuments();
        meta = {
            page: meta_data.page,
            per_page: meta_data.per_page,
            total_records: record_count
        }
        console.log(data);
        console.log(meta);

        return {
            meta: meta,
            data: data
        }    
}