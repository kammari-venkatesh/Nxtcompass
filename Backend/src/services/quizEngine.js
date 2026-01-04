/**
 * Quiz Engine
 * -----------
 * Input:
 *  - answers: [
 *      {
 *        questionId,
 *        selectedOption (option object with traits)
 *      }
 *    ]
 *
 * Output:
 *  - traitScores
 *  - branchMatches (with reasoning)
 */

const BRANCH_TRAIT_MAP = {
  "Computer Science Engineering": {
    analytical: 0.35,
    creative: 0.25,
    handsOn: 0.2,
    people: 0.1,
    leadership: 0.1,
  },
  "Electronics & Communication": {
    analytical: 0.3,
    handsOn: 0.35,
    creative: 0.15,
    people: 0.1,
    leadership: 0.1,
  },
  "Mechanical Engineering": {
    handsOn: 0.4,
    analytical: 0.25,
    leadership: 0.2,
    creative: 0.1,
    people: 0.05,
  },
  "Civil Engineering": {
    leadership: 0.35,
    people: 0.25,
    handsOn: 0.25,
    analytical: 0.1,
    creative: 0.05,
  },
  "Electrical Engineering": {
    analytical: 0.35,
    handsOn: 0.3,
    creative: 0.15,
    people: 0.1,
    leadership: 0.1,
  },
}

export const evaluateQuiz = (answers = []) => {
  const traitTotals = {
    analytical: 0,
    creative: 0,
    people: 0,
    handsOn: 0,
    leadership: 0,
  }

  // 1. Aggregate trait scores
  answers.forEach(({ selectedOption }) => {
    if (!selectedOption || !selectedOption.traits) return

    Object.keys(traitTotals).forEach((trait) => {
      traitTotals[trait] += selectedOption.traits[trait] || 0
    })
  })

  // 2. Normalize trait scores (0–100)
  const maxTraitValue = Math.max(...Object.values(traitTotals), 1)

  const normalizedTraits = {}
  Object.keys(traitTotals).forEach((trait) => {
    normalizedTraits[trait] = Math.round(
      (traitTotals[trait] / maxTraitValue) * 100
    )
  })

  // 3. Match traits to branches
  const branchMatches = Object.entries(BRANCH_TRAIT_MAP).map(
    ([branch, weights]) => {
      let score = 0

      Object.keys(weights).forEach((trait) => {
        score += (normalizedTraits[trait] || 0) * weights[trait]
      })

      return {
        branch,
        matchPercentage: Math.round(score),
        reasoning: Object.keys(weights)
          .filter((t) => weights[t] >= 0.2)
          .map((t) => `${t} strength`)
      }
    }
  )

  // 4. Sort by match %
  branchMatches.sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  )

  return {
    traitScores: normalizedTraits,
    branchMatches,
  }
}
