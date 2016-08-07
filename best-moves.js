const Pokemon = require('./pokemon.json')

function getDmg(atk, power, stab) {
  const def = 100
  const ECpM = 0.790300
  return (0.5 * atk * ECpM / (def * ECpM ) * power * stab) + 1
}

function getDPS(dmg, duration) {
  return Number((dmg / (duration / 1000)).toFixed(2))
}

function bestMovesFor(pokemonName) {
  const fmtName = pokemonName.toUpperCase()
  const mon = Pokemon.filter(x => x.name === fmtName)[0]

  if (!mon) throw new Error(`Cannot find ${fmtName}`)

  const stuff = []

  mon.moves1.forEach((move1) => {
    mon.moves2.forEach((move2) => {
      const stab1 = move1.Type === mon.type1 || move1.Type === mon.type2 ? 1.25 : 1
      const stab2 = move2.Type === mon.type1 || move2.Type === mon.type2 ? 1.25 : 1

      const total = battleDMG(move1, move2, stab1, stab2)
      const dps = getDPS(total.dmg, total.time)

      stuff.push({
        quick: move1.Name,
        charge: move2.Name,
        dps,
      })
    })
  })

  return stuff.sort((a, b) => a.dps > b.dps ? -1 : 1)[0]
}

function battleDMG(move1, move2, stab1, stab2) {
  // Assuming you only get 20 "hits" on the CPU
  return Array.from(Array(20)).reduce((x, _) => {
    var energy = x.energy
    var time = x.time
    var dmg = x.dmg

    if (energy >= Math.abs(move2.Energy)) {
      dmg += move2.Power * stab2
      time += move2.DurationMs
      energy = energy + move2.Energy
    } else {
      dmg += move1.Power * stab1
      time += move1.DurationMs
      energy = energy + move1.Energy
    }

    return { energy, time, dmg }
  }, { energy: 0, time: 0, dmg: 0 })
}

console.log(
  bestMovesFor(process.argv[2] || 'flareon')
)
