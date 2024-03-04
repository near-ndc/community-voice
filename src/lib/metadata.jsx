function generateMetadata() {
    return {
        createdTimestamp: Date.now(),
        lastEditTimestamp: Date.now(),
    }
}

function updateMetadata(metadata) {
    return {
        ...metadata,
        lastEditTimestamp: Date.now()
    }
}

return { generateMetadata, updateMetadata }