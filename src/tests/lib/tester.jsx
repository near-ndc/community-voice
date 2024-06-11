const renderFeedback = (
    functionArray,
    filteredErrorResults,
    functionsPassingTest,
    isSync
) => {
    return (
        <>
            <strong>
                Running {`${isSync ? 'sync' : 'async'}`} functions:{' '}
            </strong>
            <ul>
                {functionArray.map((fn, index) => (
                    <li className="mb-2" key={index}>
                        {fn.fnName}
                    </li>
                ))}
            </ul>
            <div>
                {Object.keys(filteredErrorResults).length ? (
                    <>
                        {/*<Note>
              *The number after the function name represents the index asociated
              to the function. You can call multiple times the same function.
            </Note>*/}
                        {functionsPassingTest.length > 0 && (
                            <div>
                                <strong className="text-success">
                                    {`${functionsPassingTest.length} function${
                                        functionsPassingTest.length > 1
                                            ? 's'
                                            : ''
                                    } have passed the test:`}
                                </strong>
                                <div className="alert alert-success">
                                    <ul>
                                        {functionsPassingTest.map((fn) => (
                                            <li
                                                className="text-success"
                                                role="alert"
                                            >
                                                {fn}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {
                            <div>
                                {Object.keys(filteredErrorResults).map((fn) => {
                                    return (
                                        <div>
                                            <strong className="text-danger">
                                                {`${fn}`}:
                                            </strong>
                                            {filteredErrorResults[fn]
                                                .description && (
                                                <span className="text-danger">
                                                    {
                                                        filteredErrorResults[fn]
                                                            .description
                                                    }
                                                </span>
                                            )}
                                            <div
                                                className="alert alert-danger"
                                                role="alert"
                                                key={i}
                                            >
                                                {filteredErrorResults[
                                                    fn
                                                ].errorList.map((error) => {
                                                    return (
                                                        <>
                                                            {typeof error ===
                                                            'string' ? (
                                                                <p className="text-danger">
                                                                    {error}
                                                                </p>
                                                            ) : Array.isArray(
                                                                  error
                                                              ) ? (
                                                                error.map(
                                                                    (e) => (
                                                                        <p className="text-danger">
                                                                            {e}
                                                                        </p>
                                                                    )
                                                                )
                                                            ) : (
                                                                <p className="text-danger">
                                                                    Error passed
                                                                    wrongly
                                                                </p>
                                                            )}
                                                            {filteredErrorResults[
                                                                fn
                                                            ].errorList.length >
                                                                1 && <hr />}
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </>
                ) : (
                    <div
                        className="alert alert-success text-success"
                        role="alert"
                    >
                        <strong>
                            {functionArray.length > 1
                                ? `All ${functionArray.length}`
                                : 'The'}{' '}
                            test{functionArray.length > 1 ? 's have' : ' has'}{' '}
                            passed
                        </strong>
                    </div>
                )}
            </div>
        </>
    )
}

function displayTestsSyncResults(functionArray) {
    if (!Array.isArray(functionArray)) {
        return { error: true, msg: 'Parameter is not an array' }
    }

    const errorResults = {}
    const functionsPassingTest = []
    for (let i = 0; i < functionArray.length; i++) {
        const fn = functionArray[i].fn

        //Sets a key for this function in errorResults
        errorResults[functionArray[i].fnName] = {}
        errorResults[functionArray[i].fnName].description =
            functionArray[i].description
        errorResults[functionArray[i].fnName].errorList = []
        if (typeof fn !== 'function') {
            errorResults[functionArray[i].fnName].errorList.push(
                `${functionArray[i].fnName} is not a function`
            )
            continue
        }

        const fnResult = fn()

        if (fnResult.isError) {
            //Error msg can be an string to use 1 line or an Array to use 1 line per element in the Array
            errorResults[functionArray[i].fnName].errorList.push(fnResult.msg)
        } else {
            functionsPassingTest.push(functionArray[i].fnName)
        }
    }

    //Filter functions without errors of list
    let filteredErrorResults = Object.keys(errorResults)
        .filter((keyName) => errorResults[keyName].errorList.length > 0)
        .reduce((newObj, key) => {
            newObj[key] = {
                description: errorResults[key].description,
                errorList: errorResults[key].errorList,
            }
            return newObj
        }, {})

    const Note = styled.strong`
        font-size: small;
    `

    return renderFeedback(
        functionArray,
        filteredErrorResults,
        functionsPassingTest,
        true
    )
}

function displayTestsAsyncResults(functionArray) {
    if (!Array.isArray(functionArray)) {
        return { error: true, msg: 'Parameter is not an array' }
    }

    const functionsReturns = []

    for (let i = 0; i < functionArray.length; i++) {
        const fn = functionArray[i].fn

        const functionReturn = fn().then((functionResponse) => {
            //Sets a key for this function in errorResults
            const functionName = functionArray[i].fnName

            let functionPassingTest
            const functionErrorResults = {}
            functionErrorResults.description = functionArray[i].description
            functionErrorResults.errorList = []

            if (typeof fn !== 'function') {
                functionErrorResults.errorList.push(
                    `${functionName} is not a function`
                )
            } else {
                if (functionResponse.isError) {
                    //Error msg can be an string to use 1 line or an Array to use 1 line per element in the Array
                    functionErrorResults.errorList.push(functionResponse.msg)
                } else {
                    functionPassingTest = functionName
                }
            }

            return { functionName, functionErrorResults, functionPassingTest }
        })
        functionsReturns.push(functionReturn)
    }

    const finalResults = Promise.all(functionsReturns).then(
        (functionsResults) => {
            const errorResults = {}
            const functionsPassingTest = []
            functionsResults.forEach((functionResult) => {
                errorResults[functionResult.functionName] =
                    functionResult.functionErrorResults
                functionsPassingTest.push(functionResult.functionPassingTest)
            })

            //Filter functions without errors of list
            let filteredErrorResults = Object.keys(errorResults)
                .filter((keyName) => errorResults[keyName].errorList.length > 0)
                .reduce((newObj, key) => {
                    newObj[key] = {
                        description: errorResults[key].description,
                        errorList: errorResults[key].errorList,
                    }
                    return newObj
                }, {})
            return { filteredErrorResults, functionsPassingTest }
        }
    )

    const Note = styled.strong`
        font-size: small;
    `

    return finalResults.then((result) => {
        3
        const { filteredErrorResults, functionsPassingTest } = result
        return renderFeedback(
            functionArray,
            filteredErrorResults,
            functionsPassingTest,
            false
        )
    })
}

return { displayTestsSyncResults, displayTestsAsyncResults }
