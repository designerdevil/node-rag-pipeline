import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import embedHandler from './util/embedHandler.js';
import retrieverHandler from './util/retrievalHandler.js';

const app = express();
const port = 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());

/**
 * Define a GET route
 */
app.get('/get-context', async (req, res) => {
	try {
		const question = req.query.question;
		const response = await retrieverHandler(question);
		res.send(response);
	} catch (error) {
		res.send({ status: "FAILED", answer: "Ooops, I\'ve encountered an unexpected error. :)" });
	}
});


/**
 * Embed documentation 
 */
app.get('/embedding-document', async (req, res) => {
	const response = await embedHandler();
	res.send({ status: response });
});


/**
 * Set storage engine for multer 
 * And create the Destination folder for uploaded files
 */
const storage = multer.diskStorage({
	destination: function (req, file, cb) {

		var folder = './uploads/'

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}

		cb(null, folder);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

// Initialize multer
const upload = multer({
	storage: storage,
});

/**
 * Define a route to handle file uploads
 * And if file was uploaded successfully, send a success response
 */
app.post('/upload', upload.single('file'), (req, res) => {

	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}

	res.json({ message: 'File uploaded successfully', fileName: req.file.filename });
});

/**
 * Start the server
 */
app.listen(port, () => {
	console.log(`Server is listening at http://localhost:${port}`);
});