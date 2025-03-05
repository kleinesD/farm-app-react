const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');

const farmRouter = require('./routes/farmRoutes');
const userRouter = require('./routes/userRoutes');
const animalRouter = require('./routes/animalRoutes');
const animalResultRouter = require('./routes/animalResultRoutes');
const vetRouter = require('./routes/vetRoutes');
const calendarRouter = require('./routes/calendarRoutes');
const inventoryRouter = require('./routes/inventoryRoutes');
const distributionRouter = require('./routes/distributionRoutes');
const feedRouter = require('./routes/feedRoutes');
const milkQualityRouter = require('./routes/milkQualityRoutes');
const vetResearchRouter = require('./routes/vetResearchRoutes');
const accRecordRouter = require('./routes/accRecordRoutes');
const notificationRouter = require('./routes/notificationRouter');
const errorController = require('./controllers/errorController')

const app = express();

app.use(express.static(path.join(__dirname, '/client/public')));

app.use(express.json());

app.use(cookieParser())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("file://")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use('/api/farms', farmRouter);
app.use('/api/users', userRouter);
app.use('/api/animals', animalRouter);
app.use('/api/animal-results', animalResultRouter);
app.use('/api/vet', vetRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/distribution', distributionRouter);
app.use('/api/feed', feedRouter);
app.use('/api/milk/quality', milkQualityRouter);
app.use('/api/research/vet', vetResearchRouter);
app.use('/api/accounting/', accRecordRouter);
app.use('/api/notifications', notificationRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;