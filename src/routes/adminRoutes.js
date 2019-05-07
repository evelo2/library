const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoute');

const adminRouter = express.Router();

async function getAllBooks(id) {
  const { recordset } = await new sql.Request()
    .input('id', sql.Int, (id || 0))
    .execute('getAllBooks');
  return recordset;
}

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      (async () => {
        const books = await getAllBooks();
        res.send(books);
      })();
    });

  return adminRouter;
}

module.exports = router;
