// models/DataModel.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  // other fields as necessary
});


const DataModel = mongoose.model('Data', dataSchema);
module.exports = DataModel;
