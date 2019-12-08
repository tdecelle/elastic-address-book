# elastic-address-book
Restful API for an address book with Elasticsearch.

- __GET__ /contact?pageSize={}&page={}&query={}
  - Returns query in array offset by page
  - PageSize is the number of max results given
  - Query must be in JSON format
- __POST__ /contact
  - Creates contact
  - Body must have a name field
  - Body may have email and phoneNumber fields
  - Email must have @
  - PhoneNumber must follow XXX-XXX-XXXX
  - Ignores all other fields
- __GET__ /contact/{name}
  - Gets document with id {name} if it exists
  - Returns error if name doesn't exist in Elasticsearch
- __PUT__ /contact/{name}
  - May update phoneNumber or email fields
  - Email must have @
  - PhoneNumber must follow XXX-XXX-XXXX
  - Name cannot be a field. Will return InvalidNameError
- __DELETE__ /contact/{name}
  - Deletes document with id {name} if it exists
  - Returns error if name doesn't exist in Elasticsearch
