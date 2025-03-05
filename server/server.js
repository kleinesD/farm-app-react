const dotenv = require('dotenv');
const path = require('path');

const animalController = require('./controllers/animalController');
const feedController = require('./controllers/feedController');
const vetController = require('./controllers/vetController');
const notificationController = require('./controllers/notificationController');
const animalResultController = require('./controllers/animalResultController');
const accRecordController = require('./controllers/accRecordController');
const isDev = require('electron-is-dev');

dotenv.config({ path: path.resolve(__dirname, '../config.env') });

const app = require('./app');
const server = require('http').createServer(app);
const mongoose = require('mongoose');


if(isDev) {
  const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);
  mongoose.connect(DB, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  }).then(con => { console.log('Database connected') })
} else {
  const DB = 'mongodb+srv://kleinesD:gupaba26@cluster0.xdhat.mongodb.net/farmme?retryWrites=true&w=majority'
  mongoose.connect(DB).then(con => { console.log('Database connected') })
}

const port = 604;
server.listen(port, () => { console.log(`Server running on port: ${port}`) });

if(isDev) console.log(`Mode: ${process.env.NODE_ENV}`);

/* Scripts */

/* Check if those functions should be recurring */
//animalController.updateCurrentInfo();

animalController.createAnimalProjection();

feedController.autoAction();
vetController.schemeAutoUpdate();
notificationController.notificationCreator();
animalController.animalTracker();
accRecordController.salaryTracker();
setInterval(() => {
  //animalController.updateCurrentInfo()
  vetController.schemeAutoUpdate();
}, 1 * 60 * 1000)
setInterval(() => {
  feedController.autoAction();
  animalController.animalTracker();
}, 24 * 60 * 60 * 1000)
module.exports = server;