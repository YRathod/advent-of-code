const VALUE_RX = /^value (\d+) goes to bot (\d+)$/
const RULE_RX = /^bot (\d+) gives low to (output|bot) (\d+) and high to (output|bot) (\d+)$/

function parseInstructions(input) {
  const outputs = []
  const bots = []
  const rules = []
  const needsToZoom = []

  input.split('\n').forEach(line => {
    let match
    if (match = VALUE_RX.exec(line)) {
      const [, value, id] = match
      if (!bots[id]) {
        bots[id] = []
      }
      bots[id].push(parseInt(value, 10))
      if (bots[id].length === 2) {
        needsToZoom.push(id)
      }
    } else if (match = RULE_RX.exec(line)) {
      const [, botID, lowKind, lowID, highKind, highID] = match
      rules[botID] = { lowKind, lowID, highKind, highID }
    }
  })

  return { outputs, bots, rules, needsToZoom }
}

function zoomAround(state, observer) {
  const { bots, rules, needsToZoom } = state

  while (needsToZoom.length > 0) {

    const botID = needsToZoom[needsToZoom.length - 1]

    // Reset this bot's values
    const [ lowVal, highVal ] = bots[botID].sort((a, b) => a - b)

    // Rules for this bot?
    const { lowKind, lowID, highKind, highID } = rules[botID]

    // Let the observer know, it can stop the show.
    if (observer && observer({ botID, lowKind, lowID, lowVal, highKind, highID, highVal }, state)) {
      break
    }

    // Put the values where they go.
    needsToZoom.pop()
    bots[botID] = undefined
    moveToDestination(state, highKind, highID, highVal)
    moveToDestination(state, lowKind, lowID, lowVal)
  }

  return state
}

function moveToDestination(state, kind, id, val) {
  const destinations = (kind === 'output' ? state.outputs : state.bots)
  const destination = destinations[id] || (destinations[id] = [])
  destination.push(val)
  if (kind === 'bot' && destination.length === 2) {
    state.needsToZoom.push(id)
  }
}



const assert = require('assert')
let testState = parseInstructions(`value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`)
assert(testState.bots[1][0] === 3)
assert(testState.bots[2][0] === 5)
assert(testState.bots[2][1] === 2)
let whichBotCompares5And2
testState = zoomAround(testState, ({ botID, highVal, lowVal }) => {
  if (highVal === 5 && lowVal === 2) {
    whichBotCompares5And2 = botID
  }
})
assert(whichBotCompares5And2 === '2')
assert(testState.outputs[0][0] === 5)
assert(testState.outputs[1][0] === 2)
assert(testState.outputs[2][0] === 3)


const input = require('fs').readFileSync('10.txt', 'utf8')
let whichBotCompares61And17
const finalState = zoomAround(parseInstructions(input), ({ botID, lowKind, lowID, lowVal, highKind, highID, highVal }, state) => {
  console.log(`bot ${botID} gives ${lowVal} to ${lowKind} ${lowID} and ${highVal} to ${highKind} ${highID}`)
  if (highVal === 61 && lowVal === 17) {
    whichBotCompares61And17 = botID
  }
})

console.log(' --- ')

console.log(`Bot ${whichBotCompares61And17} compared 61 and 17`)

console.log(finalState.outputs[0][0] * finalState.outputs[1][0]  * finalState.outputs[2][0]);