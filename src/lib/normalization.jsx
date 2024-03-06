function normalize(obj, versions, versionIndex) {
    const versionsKeys = Object.keys(versions)
    for (let i = versionIndex; i < versionsKeys.length; i++) {
        const version = versions[versionsKeys[i]]
        obj = version.normalizationFunction(obj)
    }
    return obj
}

function normalizeObjectWithMetadata(object, versions) {
    const versionsKeys = Object.keys(versions)
    const objectVersionKey = object.value.metadata.versionKey
    const versionIndex = versionsKeys.indexOf(objectVersionKey)
    normalize(obj, versions, versionIndex)
}

return { normalize, normalizeObjectWithMetadata }