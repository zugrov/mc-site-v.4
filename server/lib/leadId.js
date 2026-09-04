const { v4: uuidv4 } = require('uuid');

function generateLeadId() {
  return uuidv4();
}

function generateFakeLeadId() {
  return `fake-${uuidv4()}`;
}

module.exports = {
  generateLeadId,
  generateFakeLeadId,
};
