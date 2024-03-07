function generateMetadata(metadataHelper) {
    const { idPrefix, author, sbt, versionKey } = metadataHelper
    return {
        id: `${idPrefix}/${author}/${Date.now()}`,
        author,
        sbt, // Check lib.SBT -> getSBTWhiteList -> prop value
        createdTimestamp: Date.now(),
        lastEditTimestamp: Date.now(),
        versionKey, // Check `const versions` -> Object.keys(versions)
    }
}

function updateMetadata(previousMetadata, versionKey) {
    return {
        ...previousMetadata,
        lastEditTimestamp: Date.now(),
        versionKey
    }
}

function buildDeleteMetadata(id) {
    return {
        id,
        isDelete: true,
        deleteTimestamp: Date.now()
    }
}

return { generateMetadata, updateMetadata, buildDeleteMetadata }