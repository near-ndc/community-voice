const path = require("path");
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { keyStores, connect, Contract } = require("near-api-js");
const { homedir } = require("os");

const ACCOUNT = "communityvoice.ndctools.near"
// const ACCOUNT = "silkking.near"

function getAllFilesNames(addedPath = "") {
    const pathToSearch = path.join("./src", addedPath)
    const foldersToExclude = ["bosTests", "testingWidgets", "tests"]
    const filesToExclude = ["HelloCV.jsx"]

    const files = []

    readdirSync(pathToSearch).forEach(file => {
        if(filesToExclude.includes(file) || foldersToExclude.includes(file)) return

        const isFile = file.endsWith(".jsx")
        if(isFile) {
            files.push(path.join(addedPath, file))
        } else {
            files.push(...getAllFilesNames(path.join(addedPath, file)))
        }
    })
    return files
}

async function getContract() {
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath = path.join(homedir(), CREDENTIALS_DIR);
    console.log("credentialsPath", credentialsPath )
    const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

    const connectionConfig = {
        networkId: "mainnet",
        keyStore: myKeyStore, // first create a key store
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://nearblocks.io",
    };
    const nearConnection = await connect(connectionConfig);
    // const walletConnection = new WalletConnection(nearConnection);
    const account = await nearConnection.account(ACCOUNT);

    const contract = new Contract(
        account , // the account object that is connecting
        "social.near",
        {
            // name of contract you're connecting to
            viewMethods: [], // view methods do not change state but usually return a value
            changeMethods: ["set"], // change methods modify state
        }
    );

    return contract
}

function getWidgetsJsons(files) {
    return files.map(file => {
        const fileContent = readFileSync(path.join("./src", file), "utf-8").toString()
        
        const widgetName = file.replace(".jsx", "").split("/").join(".")
        return {
            [ACCOUNT]: {
                widget: {
                    [widgetName]: {
                        "": fileContent
                    }
                }
            }
        }
    })
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function run() {
    const indexesToDeploy = []
    const indexesWithError = []
    const files = getAllFilesNames()
    
    const widgetJsons = getWidgetsJsons(files)
    
    const socialContract = await getContract()
    for(let i = 29; i < widgetJsons.length; i++) {
        if(indexesToDeploy.length > 0 && !indexesToDeploy.includes(i)) continue
        const json = widgetJsons[i]
        const widgetName = Object.keys(json[ACCOUNT].widget)[0]
        console.log("Deploying widget with index", i, widgetName)
        try {
            await socialContract.set({
                data: json 
            },
            "300000000000000", 
            "1" + "0".repeat(21))  
            console.log("Deployed", widgetName)
        } catch(err) {
            console.log("Error deploying widget with index", i)
            console.log(err)
            indexesWithError.push(i)
        } finally {
            await sleep(1521)
        }
    }
    console.log("Indexes with error", indexesWithError)
    
}

run()