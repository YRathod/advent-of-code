const TURN = {
    RIGHT: 1,
    LEFT: -1,
  }
  
  const DIRECTION = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
  }
  
  const initialState = {
    facing: DIRECTION.NORTH,
    x: 0,
    y: 0,
  }

function moveAndFindIntersection(steps, initialState) {
    const visited = { '0,0': true }
    let state = initialState
    for (let step of steps) {
      state.facing = (state.facing + step.turn + 4) % 4
      let dist = step.dist
      for (let d = 1; d <= dist; d++) {
        switch (state.facing) {
          case DIRECTION.NORTH: state.y++; break
          case DIRECTION.SOUTH: state.y--; break
          case DIRECTION.EAST: state.x++; break
          case DIRECTION.WEST: state.x--; break
        }
        const location = state.x + ',' + state.y
        if (visited[location]) {
          return state
        }
        visited[location] = true
      }
    }
  }

  const input1 = 'R8, R4, R4, R8';
  const input2 = 'R2, L3, R2, R4, L2, L1, R2, R4, R1, L4, L5, R5, R5, R2, R2, R1, L2, L3, L2, L1, R3, L5, R187, R1, R4, L1, R5, L3, L4, R50, L4, R2, R70, L3, L2, R4, R3, R194, L3, L4, L4, L3, L4, R4, R5, L1, L5, L4, R1, L2, R4, L5, L3, R4, L5, L5, R5, R3, R5, L2, L4, R4, L1, R3, R1, L1, L2, R2, R2, L3, R3, R2, R5, R2, R5, L3, R2, L5, R1, R2, R2, L4, L5, L1, L4, R4, R3, R1, R2, L1, L2, R4, R5, L2, R3, L4, L5, L5, L4, R4, L2, R1, R1, L2, L3, L2, R2, L4, R3, R2, L1, L3, L2, L4, L4, R2, L3, L3, R2, L4, L3, R4, R3, L2, L1, L4, R4, R2, L4, L4, L5, L1, R2, L5, L2, L3, R2, L2';
  
  function solution(input){
   const steps = input.split(', ').map(pair => ({
    turn: pair[0] === 'R' ? TURN.RIGHT : TURN.LEFT,
    dist: parseInt(pair.slice(1), 10),
  }))
  
  const finalState = moveAndFindIntersection(steps, initialState)
  return Math.abs(finalState.x) + Math.abs(finalState.y)
}

console.log(solution(input1), 4)
console.log(solution(input2),120)