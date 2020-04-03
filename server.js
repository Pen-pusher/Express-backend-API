const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.json());

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// Middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File Uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.bold
	)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error : ${err.message}`);

	// Close server
	server.close(() => process.exit(1));
});
