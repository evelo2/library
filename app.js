const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const nav = [{
  link: '/books',
  title: 'Book'
},
{
  link: '/authors',
  title: 'Author'
}];

const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: 'paul.thomas777',
  password: '!Friday39',
  server: 'glnpslibrary.database.windows.net',
  database: 'pslibrary',
  options: {
    encrypt: true
  }
};

sql.connect(config).catch(err => debug(err));

app.use(morgan('combined'));
app.use((req, res, next) => {
  debug('Here I am ........');
  next();
});
app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
// app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/views/index.html')));
app.get('/', (req, res) => {
  res.render(
    'masterView',
    {
      nav,
      title: 'My Library',
      partialView: 'indexView'
    }
  );
});

app.listen(port, () => debug(`Listening at Port ${chalk.green(port)}`));
