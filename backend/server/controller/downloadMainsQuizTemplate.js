exports.downloadMainsQuizTemplate = async(req, res) => {
  
    try {
        key_arr = ["paper_id","paper_list_id","topic_id","question","description","remarks"]
        const json2csv = require('json2csv').parse;
        new_obj = {};
        for (keys in key_arr) {
            console.log(keys);
            new_obj[key_arr[keys]] = "";
        }
        const csvString = json2csv(new_obj);
        res.setHeader('Content-disposition', 'attachment; filename=template.csv');
        res.set('Content-Type', 'text/csv');

        res.status(200).send(csvString);
     }
        catch (err) {
            res.status(200).send("error");
            console.log(err.message);
        }
}