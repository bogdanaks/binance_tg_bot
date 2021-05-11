const buildQueryForSymbols = (symbols) => {
    let queryStr = ''
    symbols.forEach((symbol) => {
        queryStr += `/${symbol.toLowerCase()}@trade`
    })
    return queryStr
}

module.exports = buildQueryForSymbols