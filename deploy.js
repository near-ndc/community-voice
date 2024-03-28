const path = require("path");
const { readdirSync }   = require("fs");

function ThroughDirectory(Directory) {
    readdirSync(Directory).forEach(File => {
        const Absolute = Path.join(Directory, File);
        if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
        else return Files.push(Absolute);
    });
}

ThroughDirectory("./input/directory/");

function getAllFiles() {
    const foldersToExclude = ["bosTests", "testingWidgets", "tests"]
    const filesToExclude = ["HelloCV.jsx"]

    readdirSync("./src").forEach(file => {
        console.log(file)
    }
}

async function run() {
    getAllFiles()
    // connectToNear()
    // callSetFunction()
}

run()