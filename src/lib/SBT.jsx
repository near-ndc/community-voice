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

function isValidUser(accountId, sbt) {
  if(accountId && sbt==="public") {
    return new Promise((resolve)=>resolve(true))
  }

  return getUserSBTs(accountId).then(userSBTs => {
    const data = sbt.split(" - class ");
    const sbtsData = { name: data[0], classNumber: Number(data[1]) };
          
    const isValid = userSBTs.some((userSbt) => {
      return (
        userSbt[0] === sbtsData.name &&
        userSbt[1].find(
          (sbtExtraData) =>
            sbtExtraData.metadata.class === sbtsData.classNumber
        )
      );
    });
          
    return isValid
  })
}
  
function getUserSBTs(accountId) {
  const userSBTsPromise = Near.asyncView(registryContract, "sbt_tokens_by_owner", {
    account: accountId,
  });

  return userSBTsPromise;
}

return { getSBTWhiteList, isValidUser, getUserSBTs }