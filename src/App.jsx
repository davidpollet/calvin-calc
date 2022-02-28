// IMPORT

import './styles/styles.scss'

import { OPERATORS_REGEX, POWER_REGEX } from '../library/regex/CALC_SIGNS_REGEX'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import Bot from '../components/bot'
import Header from '../components/Header'
import calc from '../utils/calculation/calc'
import convertUnits from '../utils/conversion/convertUnits'
import debounce from 'lodash/debounce'
import formatNumber from '../library/functions/number/formatNumbers'
import isNumber from '../library/functions/number/isNumber'
import parseOperation from '../utils/calculation/parseOperation'
import removeAccent from '../library/functions/string/removeAccent'

// UTILS



// COMPONENTS

// LIBRARY




// STYLES



function App () {
  const inputRef = useRef()
  const [result, setResult] = useState('')
  const [operation, setOperation] = useState('')

  const handleTextareaChange = e => setOperation(e.target.value.toLowerCase())
  const debounceCalc = useMemo(() => debounce(handleTextareaChange, 300), [
    operation
  ])

  function inputAutoHeight () {
    if (
      operation &&
      inputRef.current.clientHeight < inputRef.current.scrollHeight
    ) {
      inputRef.current.setAttribute(
        'style',
        `height: ${inputRef.current.scrollHeight}px; border-radius: 1rem;`
      )
    } else {
      inputRef.current.removeAttribute('style')
    }

    if (!operation) inputRef.current.removeAttribute('style')
  }

  useEffect(() => {
    inputAutoHeight()

    if (operation?.match(OPERATORS_REGEX) || operation?.match(POWER_REGEX)) {
      const res = calc(parseOperation(operation))
      if (isNumber(res)) setResult(formatNumber(res, 5))
    }

    if (operation.search(/\s(en|in|to)\s/) >= 0) {
      let value = operation.match(/\d*,?\.?\d*\s*?/)[0]
      const conversionWordPosition =
        // Pour echapper le match "in" de l'unité "inch"
        operation.substring(value.length + 1).search(/\s(en|in|to)\s/) +
        value.length +
        1
      let unitSrc = operation.substring(value.length, conversionWordPosition)
      let unitTarget = operation.substring(conversionWordPosition).trim()
      const unitTargetPosition = unitTarget.match(/\s?(en|in|to)\s?/)[0].length
      unitTarget = unitTarget.substring(unitTargetPosition)

      value = parseFloat(value)
      unitSrc = removeAccent(unitSrc)
        .trim()
        .replaceAll('-', ' ')
      unitTarget = removeAccent(unitTarget).replaceAll('-', ' ')

      if (value && unitSrc && unitTarget) {
        setResult(convertUnits(value, unitSrc, unitTarget))
      }
    }

    if (!operation) setResult('')
  }, [operation])

  useEffect(() => {
    return () => {
      debounceCalc.cancel()
    }
  }, [])

  return (
    <>
      <div className='calculator'>
        <Header />
        <div className='operation'>
          <textarea
            onChange={debounceCalc}
            ref={inputRef}
            placeholder='23*(50/2), 150 - 25%, 5cm en mm, …'
            className='operation-input'
            autoFocus={true}
          ></textarea>
        </div>
      </div>
      <Bot textContent={result || ''} hasError={!result} />
    </>
  )
}

export default App
