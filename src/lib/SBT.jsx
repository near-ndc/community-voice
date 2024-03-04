let env = "mainnet"

const testnetSBTWhitelist = [
    {
      value: "fractal-v2.i-am-human.testnet - class 1",
      title: "Fractal",
      default: true,
    },
    {
      value: "community-v2.i-am-human.testnet - class 1",
      title: "Community",
    },
  ]
const mainnetSBTWhitelist = [
    {
      value: "fractal.i-am-human.near - class 1",
      title: "General",
      default: true,
    },
    { value: "community.i-am-human.near - class 1", title: "OG" },
    { value: "community.i-am-human.near - class 2", title: "Contributor" },
    {
      value: "community.i-am-human.near - class 3",
      title: "Core Contributor",
    },
    { value: "elections.ndc-gwg.near - class 2", title: "HoM" },
    { value: "elections.ndc-gwg.near - class 3", title: "CoA" },
    { value: "elections.ndc-gwg.near - class 4", title: "TC" },
    { value: "public", title: "Public" },
  ]

function setEnv(value) {
    env = value
}

function getEnv() {
  return env
}

const registryContract =
  env === "mainnet"
    ? "registry.i-am-human.near"
    : "registry-v2.i-am-human.testnet";

function getSBTWhiteList(config) {
    return config.isTest ?  testnetSBTWhitelist : mainnetSBTWhitelist;    
}

function isValidUser(accountId, sbtsNames) {
    const userSBTs = Near.view(registryContract, "sbt_tokens_by_owner", {
      account: accountId,
    });
    const isSBTContractLoaded = userSBTs !== null;
    if (!isSBTContractLoaded) {
      return undefined;
    }
  
    const sbtsData = sbtsNames.map((sbt) => {
      const data = sbt.split(" - class ");
      return { name: data[0], classNumber: Number(data[1]) };
    });
    const usersValidityBySBT = {};
    sbtsNames.forEach((sbtName, index) => {
      const isUserValid =
        isSBTContractLoaded &&
        userSBTs.find((userSbt) => {
          return (
            userSbt[0] === sbtsData[index].name &&
            userSbt[1].find(
              (sbtExtraData) =>
                sbtExtraData.metadata["class"] === sbtsData[index].classNumber
            )
          );
        }) !== undefined;
      usersValidityBySBT[sbtName] = isUserValid || sbtName === "public";
    });
  
    resultFunctionsToCall = resultFunctionsToCall.filter((call) => {
      return call.functionName !== "isValidUser";
    });
  
    // return true;
    return { ...usersValidityBySBT };
  }
  
  function getUserSBTs(accountId) {
    const userSBTsPromise = Near.asyncView(registryContract, "sbt_tokens_by_owner", {
      account: accountId,
    });
  
    return userSBTsPromise;
  }

return { getSBTWhiteList, isValidUser, getUserSBTs }