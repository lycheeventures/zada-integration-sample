
const NodeCache = require("node-cache");
const myCache = new NodeCache();

const getMemoryValue = (key) => {
    let value = myCache.get(key);

    return value
}

const setMemoryValue = (key, value, ttl = 10000) => {
    let success = myCache.set(key, value, ttl);
    return true;
}

module.exports = {
    getMemoryValue,
    setMemoryValue
}