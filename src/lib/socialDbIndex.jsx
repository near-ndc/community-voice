function getFromIndex(action, key) {
    const indexUrl = "https://api.near.social/index"
    return asyncFetch(indexUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action,
            key,
            options: {
                order: "desc"
            }
        })
    }).then((response) => response.body)

}

return { getFromIndex }