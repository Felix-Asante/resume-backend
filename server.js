import express from "express";
import pdf from "pdf-creator-node";
import fs from "fs";
import cors from "cors";
import { options } from "./config/general.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

var html = fs.readFileSync("template.html", "utf8");
var users = [
	{
		name: "Shyam",
		age: "26",
	},
	{
		name: "Navjot",
		age: "26",
	},
	{
		name: "Vitthal",
		age: "26",
	},
];

app.post("/create-pdf", (req, res) => {
	const profile = [];
	profile.push(req.body.profile);

	const { education, work, project, skill, award } = req.body;
	const document = {
		html: html,
		data: {
			profile: profile,
			projectTitle: project.projectTitle,
			projects: project.projects,
			awardTitle: award.awardTitle,
			awards: award.awards,
			educations: education.content,
			skillTitle: skill.skillTitle,
			skills: skill.competence,
			workTitle: work.workTitle,
			works: work.works,
			educationTitle: req.body.education.educationTitle,
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

app.listen(PORT, () => {
	console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
