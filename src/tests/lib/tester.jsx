function displayTestsResults(functionArray) {
  if (!Array.isArray(functionArray)) {
    return { error: true, msg: "Parameter is not an array" };
  }
  
  const errorResults = [];
  for (let i = 0; i < functionArray.length; i++) {
    const fn = functionArray[i].fn;
    const fnResult = fn();
    if (fnResult.isError) {
      errorResults.push(`Error running function`, fn.name, fnResult.msg);
    }
  }

  return (
    <>
      <div>
        {functionArray.map((fn, index) => (
          <div key={index}>Running {fn.fnName}</div>
        ))}
      </div>
      <div>
        {errorResults.length ? (
          <>
            <strong className="text-danger">
              {errorResults.length} errors:
            </strong>
            {errorResults.map((error, index) => {
              return (
                <div className="alert alert-danger" role="alert" key={index}>
                  {error}
                </div>
              );
            })}
          </>
        ) : (
          <div className="alert alert-success text-success" role="alert">
            <strong>
              {functionArray.length > 1 ? `All ${functionArray.length}` : "The"}{" "}
              test{functionArray.length > 1 ? "s have" : " has"} passed
            </strong>
          </div>
        )}
      </div>
    </>
  );
}

return { displayTestsResults };
