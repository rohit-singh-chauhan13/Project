const mongoose = require('mongoose');
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const FormDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Add index if querying by userId frequently
  },
  websiteURL: {
    type: String,
    required: true
  },
  publicIP: {
    type: String,
    required: true,
    match: ipRegex // IPv4 validation
  },
  hasLBIP: { 
    type: Boolean, 
    required: true 
  },
  lbip: {
    type: String,
    match: ipRegex // IPv4 validation
  },
  privateIP: {
    type: String,
    required: true,
    match: ipRegex // IPv4 validation
  },
  certificate: {
    type: String,
    required: true
  },
  applicationManager: {
    type: String,
    required: true
  },
  hod: {
    type: String,
    required: true
  },
  hog: {
    type: String,
    required: true
  },
  certificateUploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending',
  },

}, {
  timestamps: true, 
});

const FormData = mongoose.model('FormData', FormDataSchema);
module.exports = FormData;
