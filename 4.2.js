const assert = require('assert');
assert(isValid(parseRoomID('aaaaa-bbb-z-y-x-123[abxyz]')))
assert(isValid(parseRoomID('a-b-c-d-e-f-g-h-987[abcde]')))
assert(isValid(parseRoomID('not-a-real-room-404[oarel]')))
assert(isValid(parseRoomID('totally-real-room-200[decoy]')) === false)
assert(decryptRoomName('qzmt-zixmtkozy-ivhz', 343) === 'very encrypted name')

function parseRoomID(roomID) {
  const match = /([a-z-]+?)-(\d+)\[([a-z]+)\]/.exec(roomID)
  return {
    name: match[1],
    sectorID: parseInt(match[2], 10),
    checksum: match[3],
  }
}

function calculateChecksum(roomName) {
  const chars = roomName.split('')
  const buckets = {}
  chars.forEach(char => {
    if (char !== '-') {
      buckets[char] = (buckets[char] || 0) + 1
    }
  })
  const sorted = Object.entries(buckets).sort(([ charA, freqA ], [ charB, freqB ]) =>
    freqA < freqB ? 1 :
    freqA > freqB ? -1 :
    charA > charB ? 1 : -1
  )
  return sorted.map(([ char, freq]) => char).slice(0, 5).join('')
}

function shiftCypher(char, dist) {
  return String.fromCharCode((char.charCodeAt(0) - 97 + dist) % 26 + 97)
}

function decryptRoomName(roomName, sectorID) {
  return roomName
    .split('')
    .map(char => char === '-' ? ' ' : shiftCypher(char, sectorID))
    .join('')
}

function isValid(room) {
  return calculateChecksum(room.name) === room.checksum
}

function sumOfSectorIDs(input) {
  return input
    .split('\n')
    .map(parseRoomID)
    .filter(isValid)
    .filter(room => decryptRoomName(room.name, room.sectorID) === 'northpole object storage')
    .map(room => room.sectorID)[0]
}

const input = require('fs').readFileSync('4.txt', 'utf8')

console.log(sumOfSectorIDs(input))
