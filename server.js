'use strict'

const express = require('express');
const presenters = require('./presenters');
const app = express();
const PORT = 8080;

app.use(express.json());

const postContact = (req, res) => {
  try {
    const reply = presenters.handlePostContact(req.body).catch((err) => {
      res.status(500).send({
        message: 'Failed to add ' + name
      });
      console.error(err);
    });

    reply.then((result) => {
      res.send('ADDED ' + result.body._id);
    });
  } catch(error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const getContact = (req, res) => {
  try {
    const reply = presenters.handleGetContact(req.params.name, res).catch((err) => {
      if (err.meta.statusCode === 404) {
        res.status(404).send('Name Not Found');
      } else {
        res.status(500).send('Please report error');
        console.error(err);
      }
    });

    reply.then((result) => {
      res.send(result);
    });
  } catch(error) {
    res.status(400).send(error);
    console.error(error);
  }
}

const getContactPages = (req, res) => {
  try {
    const pageSize = req.query.pageSize;
    const pageNumber = req.query.page;
    const queryStringQuery = req.query.query;

    const reply = handleGetContactByQuery(queryStringQuery).catch((err) => {
      res.status(500).send("Error with query");
    });

    reply.then((result) => {
      if (result.hits != undefined) {
        let hits = result.hits.hits;
        hits = hits.splice(pageNumber*page, (pageNumber+1)*page);

        res.send(hits);
      } else {
        res.send("No Hits");
      }
    });
  } catch(error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const putContact = (req, res) => {
  try {
    const reply = presenters.handlePutContact(req.params.name, req.body).catch((err) => {
      if (err.meta.statusCode === 404) {
        res.status(404).send('Name Not Found');
      } else {
        res.status(500).send('Please report error');
        console.error(err);
      }
    });

    reply.then((result) => {
      if (result != undefined) {
        res.send('UPDATED ' + result.body._id);
      }
    });
  } catch(error) {
    res.status(400).send(error);
    console.error(error);
  }
};

const deleteContact = (req, res) => {
  try {
    const reply = presenters.handleDeleteContact(req.params.name).catch((err) => {
      if (err.meta.statusCode === 404) {
        res.status(404).send('Name Not Found');
      } else {
        res.status(500).send('Please report error');
        console.error(err);
      }
    });

    reply.then((result) => {
      if (result != undefined) {
        res.send('DELETED ' + result.body._id);
      }
    });
  } catch(error) {
    res.status(400).send(error);
    console.error(error);
  }
};

app.get('/contact', getContactPages);

app.get('/contact/:name', getContact);

app.post('/contact', postContact);

app.put('/contact/:name', putContact);

app.delete('/contact/:name', deleteContact);

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));
