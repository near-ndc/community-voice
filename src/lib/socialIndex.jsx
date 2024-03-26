function getIndexData(config, props) {
    return asyncFetch(config.urls.socialIndex, props)
}

return { getIndexData }