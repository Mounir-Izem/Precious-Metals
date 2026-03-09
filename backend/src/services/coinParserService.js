const parseCoinTitle = (title) => {
    return {
        rawTitle: title,
        normalizedTitle: title.toLowerCase().trim()
    }
}

module.exports = {
    parseCoinTitle
}