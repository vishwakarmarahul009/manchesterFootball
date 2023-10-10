const {
  express, hbs, path,
  mongoose, jwt, cookieParser,
  crypto, request, session,
  MongoDBStore,
} = require('../controller/imports');





port = 3500;

const userRouter = require('../routers/userRouter');
const homeRouter = require('../routers/homeRouter');
const orderRouter = require('../routers/orderRouter');
const matchRoute = require('../routers/matchRouter');
const teamRoute = require('../routers/teamRouter');
const { response } = require('express');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());



const static = path.join(__dirname, '../public');
app.use(express.static(static));
app.set('view engine', 'hbs');


const db_link = "mongodb+srv://vishwakarma9304411522:iYKrVdZQfHRZvqSw@cluster0.yptxrpi.mongodb.net/?retryWrites=true&w=majority"
mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("  database is conntected");
  })
  .catch((error) => {
    console.log(error);

  });

app.listen(port, () => {
  console.log("port is live now at 3500");
});


const JWT_SECRET = 'VISHAL';

const one_day = 1000 * 60 * 60 * 100;

var store = new MongoDBStore(
  {
    uri: 'mongodb+srv://vishwakarma9304411522:iYKrVdZQfHRZvqSw@cluster0.yptxrpi.mongodb.net/?retryWrites=true&w=majority',
    databaseName: 'manchestercity',
    collection: 'sessions'
  });

app.use(
  session({
    secret: 'xyz@234',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: one_day },
    store: store
  }));


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');

  res.redirect("/login");
})




app.use('', userRouter);
app.use('', homeRouter);
app.use('', orderRouter);
app.use('', matchRoute);
app.use('', teamRoute);