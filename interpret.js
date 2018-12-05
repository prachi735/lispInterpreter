// import the node file module
const fs = require('fs')

interpret()

function interpret () {
  let path = `testCases/sampleProgram2.txt`
  fs.readFile(path, 'utf-8', function (err, fileData) {
    if (err) throw err
    let expressions = fileData.split('\n')
    for (let expression of expressions) {
      let res = read(expression)
      res = evaluate(res, env)
      // console.log(res)
    }
  }
  )
}

function evaluate (input, env) {
  console.log(input)
}

function read (input) {
  console.log(input)
  // converting s-expression to js nested array
  input = input.replace(/\(/g, '[').replace(/\)/g, ']')
  input = input.replace(/([a-zA-Z0-9<>-]+)/g, `\"$1\",`)
  input = input.replace(/,]/g, '] ,').replace(/ /g, '').slice(0, -1)
  input = input.replace(/,]/g, '] ,').replace(/ /g, '').slice(0, -1)
  return parseArray(input)[0]
}

// envionment
let env = {}

// operations
let operations = {}
operations[`+`] = (...a) => a.reduce((a, c) => a + c)
operations[`-`] = (...a) => a.reduce((a, c) => a - c)
operations[`*`] = (...a) => a.reduce((a, c) => a * c)
operations[`/`] = (...a) => a.reduce((a, c) => a / c)
operations[`%`] = (...a) => a.reduce((a, c) => a % c)
operations[`<`] = (...a) => a.reduce((a, c) => a < c)
operations[`>`] = (...a) => a.reduce((a, c) => a > c)
operations[`<=`] = (...a) => a.reduce((a, c) => a <= c)
operations[`>=`] = (...a) => a.reduce((a, c) => a >= c)
operations[`=`] = (...a) => a.reduce((a, c) => a === c)
operations[`and`] = (...a) => a.reduce((a, b) => a && b)
operations[`or`] = (...a) => a.reduce((a, b) => a || b)
operations[`not`] = (...a) => a.map((a) => ~a)
operations[`if`] = (...a) => (a[0] ? a[1] : a[2])

// Conver to Array
function parseArray (input) {
  if (!input.startsWith('[')) return null
  let arr = []
  let result
  input = input.slice(1)
  while (!input.startsWith(']')) {
    result = parseValue(input)
    if (result === null) break
    arr.push(result[0])
    input = result[1]
    result = parseCharacter(input, ',')
    if (result == null) break
    input = result[1]
  }
  input = input.slice(1)
  return [arr, input]
}

function parseCharacter (input, ch) {
  if (input.startsWith(ch)) {
    input = input.slice(ch.length)
    return [ch, input]
  }
}

// To parse the atomic values
const parseValue = Parserfactory(parseNull, parseBoolean, parseNumber, parseString, parseArray)

function Parserfactory (...parsers) {
  return function (input) {
    if (input !== undefined) {
    }
    for (let i = 0; i < parsers.length; i++) {
      let res = parsers[i](input)
      if (res !== null) {
        return res
      }
    }
    return [null, input]
  }
}

function parseNull (input) {
  if (input.startsWith('null')) {
    return [undefined, input]
  } else return null
}

function parseBoolean (input) {
  if (input.startsWith('true')) {
    return [true, input]
  } else if (input.startsWith('false')) {
    return [false, input]
  }
  return null
}

function parseNumber (input) {
  let re = /^-?[0-9]+[1-9]*\.[0-9]+[e]{1}-?[1-9]+|^-?\d[1-9]*\.\d?|^-?[1-9]+\d*|^0/
  let result = input.match(re)
  if (result) {
    let eIndex = result[0].indexOf('e') + result[0].indexOf('E') + 1
    let n = 0
    if (eIndex > 0) {
      n = Number(result[0].substr(0, eIndex)) * 10 ** Number(result[0].substr(eIndex + 1))
    } else {
      n = Number(result[0])
    }
    return [n, input]
  } else return null
}

function parseString (input) {
  let i = 1
  let n = input.length
  if (input.startsWith('"')) {
    let str = ''
    while (input[i] !== '"' && i < n) {
      if (input[i] === '\\') {
        if (['"', '\\', '/', 'b', 'n', 'r', 't'].includes(input[i + 1])) {
          str += input.substr(i, 2)
          i += 2
        } else if (input[i + 1] === 'u') {
          if (/u[A-F0-9a-f]{4}/.test(input.substr(i + 1, 5))) {
            str += input.substr(i, 6)
            i += 6
          } else return null
        } else return null
      } else {
        str += input[i]
        i++
      }
    }
    input = input.slice(i + 1)
    return [str, input]
  }
  return null
}
