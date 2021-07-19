const express = require("express");
var cors = require("cors");
const { exec } = require("child_process");
var fs = require("fs");
// const simpleGit = require("simple-git");
var NodeGit = require("nodegit");

const PORT = 3001;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", function (req, res) {
  return res.send({ error: true, message: "hello" });
});

app.post("/git-repo", async function (req, res) {
  const APP_DATA_DIR = req.body.name.split(".git").join("").split("/")[
    req.body.name.split(".git").join("").split("/").length - 1
  ];
  await NodeGit.Clone(req.body.name, APP_DATA_DIR);
  await fs.writeFileSync(`./${APP_DATA_DIR}/test.txt`, "Test", {
    encoding: "utf8",
    flag: "a+",
    mode: 0o666,
  });
  console.log(111, NodeGit.Index);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
