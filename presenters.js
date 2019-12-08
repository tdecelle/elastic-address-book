'use strict'

const esServer = require('./Elasticsearch/elasticsearch_server');
const Errors = require('./errors');

const isName = (name) => {
  if (name != undefined && typeof name === "string") {
    return true;
  } else {
    return false;
  }
}

const isPhoneNumber = (phoneNumber) => {
  return /^[0-9]{3}[-][0-9]{3}[-][0-9]{4}/.test(phoneNumber);
}

const isEmail = (email) => {
  if (email != undefined && typeof email === "string" && email.includes("@")) {
    return true;
  } else {
    return false;
  }
}

const handlePostContact = (body) => {
  const name = body.name;
  const phoneNumber = body.phoneNumber;
  const address = body.address;
  const email = body.email;
  const birthday = body.birthday;
  const newContact = {};

  if (isName(name)) {
    newContact.name = name;
  } else {
    throw new Errors.InvalidNameError(name);
  }
  if (isPhoneNumber(phoneNumber)) {
    newContact.phoneNumber = phoneNumber;
  } else if (phoneNumber != undefined) {
    throw new Errors.IvalidPhoneNumberError(phoneNumber);
  }
  if (isEmail(email)) {
    newContact.email = email;
  } else if (email != undefined) {
    throw new Errors.IvalidEmailError(email);
  }

  return esServer.createContact(newContact.name, newContact);
}

const handleGetContact = async (name) => {
  if (isName(name)) {
    return esServer.readContact(name);
  }
}

const handleGetContactByQuery = async (query) => {
  return esServer.readContactQuery({ query: query });
}

const handlePutContact = (name, body) => {
  if (body.name != undefined) {
    throw new Errors.InvalidPutError();
  }

  const newContact = {};
  const phoneNumber = body.phoneNumber;
  const address = body.address;
  const email = body.email;
  const birthday = body.birthday;

  if (isPhoneNumber(phoneNumber)) {
    newContact.phoneNumber = phoneNumber;
  } else if (phoneNumber != undefined) {
    throw new Errors.IvalidPhoneNumberError(email);
  }
  if (isEmail(email)) {
    newContact.email = email;
  } else if (email != undefined) {
    throw new Errors.InvalidEmailError(email);
  }

  return esServer.updateContact(name, newContact);
}

const handleDeleteContact = (name) => {
  if (isName(name)) {
    return esServer.deleteContact(name);
  }
}

exports.handlePostContact = handlePostContact;
exports.handleGetContact = handleGetContact;
exports.handlePutContact = handlePutContact;
exports.handleDeleteContact = handleDeleteContact;
exports.handleGetContactByQuery = handleGetContactByQuery;
exports.isName = isName;
exports.isPhoneNumber = isPhoneNumber;
exports.isEmail = isEmail;
