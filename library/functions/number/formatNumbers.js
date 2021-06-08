function formatNumbers (number, decimalRequest = 2) {
  const baseDecimal = parseInt(1 + '0'.repeat(decimalRequest))
  return (
    Intl.NumberFormat(undefined, { maximumFractionDigits: decimalRequest })
      .format(Math.round(number * baseDecimal) / baseDecimal)
  )
}

export default formatNumbers
