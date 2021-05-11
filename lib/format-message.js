
const formatSymbols = (data, symbols) => {
  let str = ''
  symbols.forEach((s) => {
    str += `
<pre>${s} - ${Number(data[s]).toFixed(4)}</pre>`
  })
  return str
}

const formatMessage = (data, symbols) => {
  const curDate = new Date().toLocaleTimeString()
  const str =
`
<b><i>Show crypto course</i></b>
<b>time</b> - ${curDate}
${formatSymbols(data, symbols)}
`

  return str
}

module.exports = formatMessage