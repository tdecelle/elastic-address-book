class InvalidNameError extends Error {
  constructor(name) {
    const message = "Invalid Name: " + name + " must be defined and a string";
    super(message);
    this.name = "InvalidNameError";
  }
}

class InvalidPhoneNumberError extends Error {
  constructor(phoneNumber) {
    const message = "Invalid Phone Number: " + phoneNumber + " must be seven digits";
    super(message);
    this.name = "InvalidPhoneNumberError";
  }
}

class InvalidEmailError extends Error {
  constructor(email) {
    const message = "Invalid email: " + email + " must contain @";
    super(message);
    this.name = "InvalidEmailError";
  }
}

class InvalidPutError extends Error {
  constructor() {
    const message = "InvalidPutError: PUT doesn't support changing names";
    super(message);
    this.name = "InvalidPutError";
  }
}

exports.InvalidNameError = InvalidNameError;
exports.InvalidPhoneNumberError = InvalidPhoneNumberError;
exports.InvalidEmailError = InvalidEmailError;
exports.InvalidPutError = InvalidPutError;
