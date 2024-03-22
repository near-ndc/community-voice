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

/**
 * 
 * @param {*} oldFormatId examples "c-acc.near-165198498" "uv-acc.near-841981914"
 * @param {*} idPrefix examples "article" "comments"
 * @returns 
 */
function normalizeId(oldFormatId, idPrefix) {
    const split = oldFormatId.split("-")
    const createdAt = split[split.length - 1]
    split.pop()
    split.shift() // Removes first
    const accountId = split.join("-")
    return `${idPrefix}/${accountId}/${createdAt}`
}

return { normalize, normalizeObjectWithMetadata, normalizeId }