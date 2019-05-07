const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoute');

const bookRouter = express.Router();

const getAllBooks = (id) => new sql.Request().input('id', sql.Int, (id || 0)).execute('getAllBooks');

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      getAllBooks()
        .then(result => {
          const books = result.recordset;
          debug(result);
          res.render(
            'masterView',
            {
              nav,
              title: 'Books',
              books,
              partialView: 'bookListView'
            }
          );
        });
    });
  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function getBooks() {
        const { id } = req.params;
        const { recordset } = await getAllBooks(parseInt(id, 10));
        debug(`ID: ${id}`);
        [req.book] = recordset;
        debug(req.book);
        next();
      }());
    })
    .get((req, res) => {
      res.render(
        'masterView',
        {
          nav,
          title: 'A Book',
          book: req.book,
          partialView: 'bookView'
        }
      );
    });
  return bookRouter;
}

module.exports = router;
