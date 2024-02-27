function displayTestsResults(functionArray) {
    if (!Array.isArray(functionArray)) {
        return { error: true, msg: "Parameter is not an array" }
    }
    const errorResults = []
    for (let i = 0; i < functionArray.length; i++) {
        const fn = functionArray[i].fn
        const fnResult = fn();
        if (fnResult.isError) {
            errorResults.push(`Error running function`, fn.name, fnResult.msg)
        }
    }

    return <>
        <div>{functionArray.map((fn, index) => <div key={index}>Running {fn.fnName}</div>)}</div>
        <div>{errorResults.map((error, index) => {
        return <div key={index}>{error}</div>
    }) || `All ${functionArray.length} tests have passed`}</div></>
}

return { displayTestsResults }