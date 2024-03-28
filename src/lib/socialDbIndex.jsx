const DEFAULT_ORDER = "desc"

function getFromIndex(action, key, order) {
    if(!order){
        order = DEFAULT_ORDER
    } 
    const indexUrl = "https://api.near.social/index"
    return asyncFetch(indexUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action,
            key,
            options: {
                order
            }
        })
    }).then((response) => response.body)

}

return { getFromIndex }