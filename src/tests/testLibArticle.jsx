const { getLatestEdits } = VM.require("sayalot.near/widget/lib.article")
const { displayTestsResults } = VM.require("sayalot.near/widget/tests.lib.tester")

function testLatestEditsRepeatedArticle() {
    const fnName = "testLatestEdits"
    // const articleIndexes = [
    //     {
    //         accountId: "test.near",
    //         blockHeight: 191891118,
    //         value: {
    //             type: "md",
    //             articleId: "test.near-1651981918"
    //         }
    //     },
    //     {
    //         accountId: "test.near",
    //         blockHeight: 191891117,
    //         value: {
    //             type: "md",
    //             articleId: "test.near-1651981918"
    //         }
    //     },
    //     {
    //         accountId: "test.near",
    //         blockHeight: 191891117,
    //         value: {
    //             type: "md",
    //             articleId: "test.near-1651981919"
    //         }
    //     }
    // ]
    const articleIndexes = [];
    let functionLatestEdit
    console.log(0)
    try {
        functionLatestEdit = getLatestEdits(articleIndexes)
    } catch(err) {
        console.log(2)
        return {
            isError: true,
            msg: err.message,
            fnName
        }
    }

    const expectedLatestEdit = []
    const isError = JSON.stringify(functionLatestEdit) !== JSON.stringify(expectedLatestEdit)
    console.log(1, isError)
    return { 
        isError: isError, 
        msg: isError ? `Items don't match ${functionLatestEdit}, ${JSON.stringify(expectedLatestEdit)}` : "", 
        fnName
    }
    // return JSON.stringify(functionLatestEdit) === JSON.stringify(expectedLatestEdit)
}

function testLatestEditEmptyIndex() {
    const articleIndexes = []
    let functionLatestEdit
    try {
        functionLatestEdit = getLatestEdits(articleIndexes)
    } catch(err) {
        return {
            isError: true,
            msg: err.message,
            fnName
        }
    }

    const expectedLatestEdit = []
    const isError = JSON.stringify(functionLatestEdit) !== JSON.stringify(expectedLatestEdit)
    return { 
        isError: isError, 
        msg: isError ? `Items don't match output ${functionLatestEdit}, expected ${expectedLatestEdit}` : "", 
        fnName
    }

}

return <>
    {
        displayTestsResults([
            {
                fnName: "testLatestEditsRepeatedArticle", 
                fn: testLatestEditsRepeatedArticle
            },
            {
                fnName: "testLatestEditEmptyIndex", 
                fn: testLatestEditEmptyIndex
            }
        ])
    }
</>