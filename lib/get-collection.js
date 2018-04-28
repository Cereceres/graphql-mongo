module.exports = (parent) => {
    const collection = parent
        .replace(/([a-z](?=[A-Z]))/g, '$1 ')
        .split(' ')
        .slice(1)
        .join('');
    return collection.charAt(0).toLowerCase() + collection.slice(1);
};
