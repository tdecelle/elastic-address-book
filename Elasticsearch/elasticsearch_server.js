'use strict'

const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
const INDEX = 'contacts';

const createContact = async function(name, contactBody) {
  return client.index({
    index: INDEX,
    id: name,
    body: contactBody
  });
}

const readContact = async function(contactName) {
  await client.indices.refresh({ index: INDEX });

  const { body } = await client.get({
    index: INDEX,
    id: contactName
  });

  return body;
}

const readContactQuery = async function(query) {
  await client.indices.refresh({ index: INDEX });

  const { body } = await client.search({
    index: INDEX,
    searchType: 'dfs_query_then_fetch',
    body: query
  });

  return body;
}

const updateContact = async function(contactName, update) {
  return await client.update({
    index: INDEX,
    id: contactName,
    body: {
      doc: update
    }
  });
}

const deleteContact = async function(name) {
  return await client.delete({
    index: INDEX,
    id: name
  });
}

const deleteAllContacts = async function() {
  return await client.indices.delete({
    index: INDEX
  }).catch((err) => {
    console.error("deleteAllContacts error: ");
    console.error(err)
  });
}

exports.createContact = createContact;
exports.readContact = readContact;
exports.updateContact = updateContact;
exports.deleteContact = deleteContact;
exports.readContactQuery = readContactQuery;
