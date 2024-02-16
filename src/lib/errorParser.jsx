function parseError(error) {
    if(!Array.isArray(error)) return error
    
    return error.map((err, index) => {
        return <div key={index}>{err}</div>
    })
}

return { parseError }