function camelCaseToUserReadable(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}

return { camelCaseToUserReadable, isValidUrl };