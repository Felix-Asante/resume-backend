import express from "express";
import pdf from "pdf-creator-node";
import fs from "fs";
import cors from "cors";
import { options } from "./config/general.js";
import path from "path";
import { fileURLToPath } from "url";
import pdfToBase64 from "pdf-to-base64";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var html = fs.readFileSync("template.html", "utf8");

app.post("/create-pdf", (req, res) => {
	const profile = [];
	profile.push(req.body.profile);

	const { education, work, project, skill, award } = req.body;
	const document = {
		html: html,
		data: {
			profile: profile,
			projectTitle: project?.projectTitle,
			projects: project?.projects,
			awardTitle: award?.awardTitle,
			awards: award?.awards,
			educations: education?.content,
			skillTitle: skill?.skillTitle,
			skills: skill?.competence,
			workTitle: work?.workTitle,
			works: work?.works,
			educationTitle: education?.educationTitle,
		},
		path: "./output.pdf",
		type: "",
	};

	pdf
		.create(document, options)
		.then((res) => {
			console.log(res);
		})
		.catch((error) => {
			console.error(error);
		});

	res.status(200).json({ data: req.body });
});

app.get("/fetch-pdf", (req, res) => {
	var data = fs.readFileSync(`${__dirname}/output.pdf`);
	res.contentType("application/pdf");
	pdfToBase64(`${__dirname}/output.pdf`)
		.then((response) => {
			res.json({ data: response });
		})
		.catch((error) => {
			console.log(error); //Exepection error....
		});

	// res.sendFile(__dirname + "/output.pdf");
});
app.listen(PORT, () => {
	console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
