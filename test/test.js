const assert = require('assert');
const esServer = require('../Elasticsearch/elasticsearch_server');
const presenters = require('../presenters');

describe('presenters', function() {
  describe('handlePostContact', function() {
    it('should create a new contact', async function() {
      try {
        const name = 'ryan';
        const phoneNumber = '111-111-1111';
        const doc = { name, phoneNumber };
        await presenters.handlePostContact(doc);

        const reply = await esServer.readContact(name);

        assert.equal(reply._id, name);
        assert.equal(reply._source.name, name);
        assert.equal(reply._source.phoneNumber, phoneNumber);
      } catch(err) {
        console.error(err);
        console.error("Failed: handlePostContact");
        assert.equal(true, false);
      }
    });

    it('should error when "name" is not given', async function() {
      try {
        const doc = { ignore : "ignore" };
        await presenters.handlePostContact(doc);
        assert.equal(true, false);
      } catch(err) {
        assert.equal(err.name, "InvalidNameError");
      }
    });
  });

  describe('isName', function() {
    it('should return true if name is a string', function() {
      assert.equal(true, presenters.isName("Tim"));
    });

    it('should return false if name is undefined', function() {
      assert.equal(false, presenters.isName(undefined));
    });
  });

  describe('isEmail', function() {
    it('should return true if email contains @', function() {
      assert.equal(true, presenters.isEmail("t@gmail.com"));
    });

    it('should return false if email is undefined', function() {
      assert.equal(false, presenters.isEmail(undefined));
    });
  });

  describe('isPhoneNumber', function() {
    it('should return true if number follows XXX-XXX-XXXX', function() {
      assert.equal(true, presenters.isPhoneNumber("123-456-7890"));
    });

    it('should return false if number is undefined', function() {
      assert.equal(false, presenters.isPhoneNumber(undefined));
    });
  });

  describe('handleGetContact', function() {
    it('should get already inserted contact', async function() {
      const name = 'ryan';
      const reply = await presenters.handleGetContact(name);

      assert.equal(reply._id, name);
    });

    it('should error when name does not exist', async function() {
      try {
        const name = 'NOT_HERE';
        const reply = await presenters.handleGetContact(name);
      } catch(err) {
        assert.equal(err.meta.statusCode, 404);
      }
    });
  });

  describe('handleGetContactByQuery', function() {
    it('should get contacts based on query', async function() {
      const name = 'Tim';
      const doc = { name };
      await presenters.handlePostContact(doc);
      const name2 = 'Tom';
      const doc2 = { name: name2 };
      await presenters.handlePostContact(doc2);

      let query = { match: { name: '(Tom) OR (Tim)' } };

      const reply = await presenters.handleGetContactByQuery(query);

      assert.equal(reply.hits.total.value, 2);
    });
  });

  describe('handlePutContact', function() {
    it('should update a contact', async function() {
      const name = 'ryan';
      const phoneNumber = '999-999-9999';
      const doc = { phoneNumber };
      await presenters.handlePutContact(name, doc);
      const reply = await presenters.handleGetContact(name);

      assert.equal(reply._source.phoneNumber, phoneNumber);
    });

    it('should not update if name field is in body', async function() {
      try {
        const name = 'NOT_HERE';
        const doc = { name };

        await presenters.handlePutContact(name, doc);
        assert.equal(true, false);
      } catch(err) {
        assert.equal(err.name, "InvalidPutError");
      }
    });

    it('should error if name in param does not exist', async function() {
      try {
        const name = 'NOT_HERE';
        const doc = {};

        await presenters.handlePutContact(name, doc);
        assert.equal(true, false);
      } catch(err) {
        assert.equal(err.meta.statusCode, 404);
      }
    });
  });

  describe('handleDeleteContact', function() {
    it('should delete already created contact', async function() {
      try {
        const name = 'ryan';
        const reply = await esServer.readContact(name);
        assert.equal(reply._id, name);
        await presenters.handleDeleteContact(name);
        await esServer.readContact(name);
      } catch(err) {
        assert.equal(err.meta.statusCode, 404);
      }
    });

    it('should error if name has not been created', async function() {
      try {
        const name = 'NOT_HERE';
        await presenters.handleDeleteContact(name);
        assert.equal(true, false);
      } catch(err) {
        assert.equal(err.meta.statusCode, 404);
      }
    });
  });
});

describe('esServer', function() {
  describe('createContact', function() {
    it('should create a new contact', async function() {
      const name = 'Ryan';
      const phoneNumber = '111-111-1111';
      const doc = { name, phoneNumber };
      esServer.createContact(name, doc);

      const reply = await esServer.readContact(name);

      assert.equal(reply._id, name);
    });
  });

  describe('readContact', function() {
    it('should read a contact', async function() {
      const name = 'Ryan';

      const reply = await esServer.readContact(name);

      assert.equal(reply._source.name, name);
    });
  });

  describe('updateContact', function() {
    it('should update a contact', async function() {
      const name = 'Ryan';
      const updatedPhoneNumber = '999-999-9999';
      const update = { phoneNumber: updatedPhoneNumber};
      await esServer.updateContact(name, update);

      const reply = await esServer.readContact(name);

      assert.equal(reply._source.phoneNumber, updatedPhoneNumber);
    });
  });

  describe('deleteContact', function() {
    it('should delete a contact', async function() {
      try {
        const name = 'Ryan';
        await esServer.deleteContact(name);
        const reply = await esServer.readContact(name);
      } catch(err) {
        assert.equal(err.meta.statusCode, 404);
      }
    });
  });

  describe('readContactQuery', function() {
    it('should read multiple contacts at once', async function() {
      let name = 'Tim';
      let doc = { name };
      await esServer.createContact(name, doc);
      name = 'Tom';
      doc = { name };
      await esServer.createContact(name, doc);

      let query = { query: { match: { name: '(Tom) OR (Tim)' } } };

      const reply = await esServer.readContactQuery(query);

      assert.equal(reply.hits.total.value, 2);
    });
  });
});
