import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Player {
  id: string
  name: string
  // Batting stats
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dotBallsFaced: number
  // Bowling stats
  overs: number
  maidens: number
  wickets: number
  economy: number
  dotBalls: number
  wides: number
  noBalls: number
}

interface Bowler {
  id: string
  name: string
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
}

export interface Team {
  id: string
  name: string
  players: Player[]
  totalRuns: number
  wickets: number
  overs: number
  currentRunRate: number
}

interface Partnership {
  batsman1Id: string
  batsman2Id: string
  runs: number
  balls: number
  startOver: number
  endOver: number | null
}

interface PowerPlayStats {
  overs: number
  runs: number
  wickets: number
  runRate: number
}

export interface Match {
  id: string
  date: string
  venue: string
  format: 'T20' | 'ODI' | 'Test'
  tossWinner: string
  tossDecision: 'bat' | 'field'
  battingTeam: Team
  bowlingTeam: Team
  currentBatsmen: string[]
  currentBowler: string
  lastBall: {
    runs: number
    wicket: boolean
    extras: number
  }
  matchStatus: 'not_started' | 'in_progress' | 'completed'
  umpires: {
    onField: string[]
    thirdUmpire: string
  }
  partnerships: Partnership[]
  currentPartnership: Partnership | null
  powerPlayStats: PowerPlayStats
}

interface MatchState {
  currentMatch: Match | null
  matchHistory: Match[]
}

const initialState: MatchState = {
  currentMatch: null,
  matchHistory: [],
}

const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    startNewMatch: (state, action: PayloadAction<Match>) => {
      state.currentMatch = {
        ...action.payload,
        matchStatus: 'in_progress',
        battingTeam: {
          ...action.payload.battingTeam,
          totalRuns: 0,
          wickets: 0,
          overs: 0,
          currentRunRate: 0,
        },
        bowlingTeam: {
          ...action.payload.bowlingTeam,
          totalRuns: 0,
          wickets: 0,
          overs: 0,
          currentRunRate: 0,
        },
        partnerships: [],
        currentPartnership: null,
        powerPlayStats: {
          overs: 0,
          runs: 0,
          wickets: 0,
          runRate: 0,
        },
      }
    },
    updateBall: (state, action: PayloadAction<{
      runs: number
      wicket: boolean
      extras: number
      batsmanId: string
      bowlerId: string
      isWide: boolean
      isNoBall: boolean
    }>) => {
      if (state.currentMatch) {
        const { runs, wicket, extras, batsmanId, bowlerId, isWide, isNoBall } = action.payload
        const battingTeam = state.currentMatch.battingTeam
        const bowlingTeam = state.currentMatch.bowlingTeam

        // Update batting team stats
        battingTeam.totalRuns += runs + extras
        battingTeam.wickets += wicket ? 1 : 0
        battingTeam.overs += 1/6
        battingTeam.currentRunRate = (battingTeam.totalRuns / battingTeam.overs)

        // Update bowling team stats
        bowlingTeam.totalRuns += runs + extras
        bowlingTeam.wickets += wicket ? 1 : 0
        bowlingTeam.overs += 1/6
        bowlingTeam.currentRunRate = (bowlingTeam.totalRuns / bowlingTeam.overs)

        // Update batsman stats
        const batsman = battingTeam.players.find(p => p.id === batsmanId)
        if (batsman) {
          batsman.runs += runs
          batsman.balls += 1
          batsman.strikeRate = (batsman.runs / batsman.balls) * 100
          if (runs === 4) batsman.fours += 1
          if (runs === 6) batsman.sixes += 1
          if (runs === 0) batsman.dotBallsFaced += 1
        }

        // Update bowler stats
        const bowler = bowlingTeam.players.find(p => p.id === bowlerId)
        if (bowler) {
          bowler.overs += 1/6
          bowler.runs += runs + extras
          bowler.wickets += wicket ? 1 : 0
          bowler.maidens += (runs === 0 && !extras) ? 1 : 0
          bowler.economy = (bowler.runs / bowler.overs)
          if (runs === 0) bowler.dotBalls += 1
          if (isWide) bowler.wides += 1
          if (isNoBall) bowler.noBalls += 1
        }

        // Update partnership stats
        if (state.currentMatch.currentPartnership) {
          state.currentMatch.currentPartnership.runs += runs
          state.currentMatch.currentPartnership.balls += 1
        }

        // Update power play stats (first 6 overs in T20, first 10 in ODI)
        const powerPlayOvers = state.currentMatch.format === 'T20' ? 6 : 10
        if (battingTeam.overs <= powerPlayOvers) {
          state.currentMatch.powerPlayStats.overs += 1/6
          state.currentMatch.powerPlayStats.runs += runs + extras
          state.currentMatch.powerPlayStats.wickets += wicket ? 1 : 0
          state.currentMatch.powerPlayStats.runRate = 
            (state.currentMatch.powerPlayStats.runs / state.currentMatch.powerPlayStats.overs)
        }

        // Handle wicket and partnership changes
        if (wicket) {
          if (state.currentMatch.currentPartnership) {
            state.currentMatch.currentPartnership.endOver = battingTeam.overs
            state.currentMatch.partnerships.push(state.currentMatch.currentPartnership)
          }
          // Start new partnership with next batsman
          state.currentMatch.currentPartnership = {
            batsman1Id: state.currentMatch.currentBatsmen[0],
            batsman2Id: state.currentMatch.currentBatsmen[1],
            runs: 0,
            balls: 0,
            startOver: battingTeam.overs,
            endOver: null,
          }
        }

        // Update last ball
        state.currentMatch.lastBall = {
          runs,
          wicket,
          extras
        }
      }
    },
    completeMatch: (state) => {
      if (state.currentMatch) {
        state.currentMatch.matchStatus = 'completed'
        state.matchHistory.push(state.currentMatch)
        state.currentMatch = null
      }
    },
    switchBatsman: (state, action: PayloadAction<{
      batsmanId: string
      newBatsmanId: string
    }>) => {
      if (state.currentMatch) {
        const { batsmanId, newBatsmanId } = action.payload
        const battingTeam = state.currentMatch.battingTeam
        const currentBatsmen = [...state.currentMatch.currentBatsmen]
        
        const index = currentBatsmen.indexOf(batsmanId)
        if (index !== -1) {
          currentBatsmen[index] = newBatsmanId
          state.currentMatch.currentBatsmen = currentBatsmen
        }
      }
    },
    switchBowler: (state, action: PayloadAction<{
      bowlerId: string
      newBowlerId: string
    }>) => {
      if (state.currentMatch) {
        const { bowlerId, newBowlerId } = action.payload
        state.currentMatch.currentBowler = newBowlerId
      }
    },
    saveMatchState: (state) => {
      if (state.currentMatch) {
        const savedMatches = JSON.parse(localStorage.getItem('savedMatches') || '[]')
        savedMatches.push({
          ...state.currentMatch,
          savedAt: new Date().toISOString(),
        })
        localStorage.setItem('savedMatches', JSON.stringify(savedMatches))
      }
    },
    loadMatchState: (state, action: PayloadAction<string>) => {
      const savedMatches = JSON.parse(localStorage.getItem('savedMatches') || '[]')
      const match = savedMatches.find((m: Match) => m.id === action.payload)
      if (match) {
        state.currentMatch = match
      }
    },
    deleteSavedMatch: (state, action: PayloadAction<string>) => {
      const savedMatches = JSON.parse(localStorage.getItem('savedMatches') || '[]')
      const updatedMatches = savedMatches.filter((m: Match) => m.id !== action.payload)
      localStorage.setItem('savedMatches', JSON.stringify(updatedMatches))
    },
  },
})

export const {
  startNewMatch,
  updateBall,
  completeMatch,
  switchBatsman,
  switchBowler,
  saveMatchState,
  loadMatchState,
  deleteSavedMatch,
} = matchSlice.actions

export default matchSlice.reducer 