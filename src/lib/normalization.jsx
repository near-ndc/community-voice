function normalize(obj, versions, versionIndex) {
    console.log(versions)
    const versionsKeys = Object.keys(versions)
    for (let i = versionIndex; i < versionsKeys.length; i++) {
        const version = versions[versionsKeys[i]]
        obj = version.normalizationFunction(obj)
    }
    return obj
}

return { normalize }