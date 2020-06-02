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
  
  function isValid(room) {
    return calculateChecksum(room.name) === room.checksum
  }
  
  function sumOfSectorIDs(input) {
    return input
      .split('\n')
      .map(parseRoomID)
      .filter(isValid)
      .reduce((sum, room) => sum + room.sectorID, 0)
  }
  
  const input1 = 'aaaaa-bbb-z-y-x-123[abxyz]';
  const input2 = 'a-b-c-d-e-f-g-h-987[abcde]';
  const input3 = 'not-a-real-room-404[oarel]';
  const input4 = 'not-a-real-room-404[oarel]';

 
  const input = require('fs').readFileSync('4.txt', 'utf8') 
  
  console.log(isValid(parseRoomID(input1)), true);
  console.log(isValid(parseRoomID(input2)), true);
  console.log(isValid(parseRoomID(input3)), true);
  console.log(isValid(parseRoomID(input4)), false);
  console.log(sumOfSectorIDs(input));