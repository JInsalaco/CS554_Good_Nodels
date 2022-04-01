/*
 * Helper JS file to check for Int and string types when passed in
 * All functions will throw an error if needed
 */
let { ObjectId } = require("mongodb");

function checkInt(inputInt, func) {
  if (!inputInt) throw `Error: did not pass in any int! in ${func}`;
  if (inputInt.length === 0) throw `Error: passed in empty int! in ${func}`;
  const parsed = parseInt(inputInt);
  if (isNaN(parsed)) throw `Error: did not pass in an int! in ${func}`;
  if (parsed < 1) throw `Error: int must be non-negative! in ${func}`;
  return parsed;
}

function checkID(inputID, func) {
  let returnID;
  if (!inputID) throw `Error: did not pass in an id! in ${func}`;
  if (inputID.length === 0) throw `Error: passed in an empty ID! in ${func}`;
  try {
    returnID = ObjectId(inputID)
  } catch (e) {
    throw `Error: did not pass in a valid objectID! in ${func}`;
  }
  return returnID;
}

function checkStr(inputStr, func) {
  if (!inputStr) throw `Error: did not pass in any string! in ${func}`;
  if (inputStr.length === 0) throw `Error: passed in an empty string! in ${func}`;
  if (inputStr.trim().length === 0) throw `Error: passed in string with only spaces! in ${func}`;
  return inputStr.toLowerCase().trim();
}

module.exports = { checkInt, checkID, checkStr };