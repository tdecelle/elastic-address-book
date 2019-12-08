class Contact {
  constructor(name) {
    this.name = name;
  }

  setName(name) {
    this.name = name;
  }

  setPhoneNumber(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  setAddress(address) {
    this.address = address;
  }

  setEmail(email) {
    this.email = email;
  }

  setBirthday(birthday) {
    this.birthday = birthday;
  }
}

exports.contact = Contact;
