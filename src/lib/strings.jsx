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

function arrayIncludesIgnoreCase(arr, value) {
    return arr.some((item) => item.toLowerCase().includes(value.toLowerCase()));
}

return { camelCaseToUserReadable, isValidUrl, arrayIncludesIgnoreCase };