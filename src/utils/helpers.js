module.exports = {
    getSlug: (title) => {
        return title.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
    },
}