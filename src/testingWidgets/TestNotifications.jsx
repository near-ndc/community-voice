const {functionsToTest} = VM.require("communityvoice.ndctools.near/widget/lib.notifications");

const arr1 = ["Martín"];
const arr2 = ["Martín", "silkking.near"];
const arr3 = ["Martín", "silkking.near", "bb"];
const arr4 = ["Martín", "silkking.near", "bb", "fiufiu"];

const {joinPeoplesName} = functionsToTest;

return (
    <>
        <div>{joinPeoplesName(arr1)}</div>
        <div>{joinPeoplesName(arr2)}</div>
        <div>{joinPeoplesName(arr3)}</div>
        <div>{joinPeoplesName(arr4)}</div>
    </>
)
