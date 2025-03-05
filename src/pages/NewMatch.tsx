import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { startNewMatch } from '../features/matchSlice'
import type { Player } from '../features/matchSlice'
import PlayerSetup from '../components/PlayerSetup'
import UmpireSetup from '../components/UmpireSetup'

const initializePlayer = (player: { id: string; name: string }): Player => ({
  ...player,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  strikeRate: 0,
  dotBallsFaced: 0,
  overs: 0,
  maidens: 0,
  wickets: 0,
  economy: 0,
  dotBalls: 0,
  wides: 0,
  noBalls: 0,
})

const NewMatch = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    team1Name: '',
    team2Name: '',
    venue: '',
    format: 'T20',
    tossWinner: '',
    tossDecision: 'bat',
    team1Players: [] as { id: string; name: string }[],
    team2Players: [] as { id: string; name: string }[],
    umpires: {
      onField: ['', ''],
      thirdUmpire: '',
    },
    openingBatsmen: [] as string[],
    openingBowler: '',
  })

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleTeam1PlayersSet = (players: { id: string; name: string }[]) => {
    setFormData({ ...formData, team1Players: players })
    setStep(3)
  }

  const handleTeam2PlayersSet = (players: { id: string; name: string }[]) => {
    setFormData({ ...formData, team2Players: players })
    setStep(4)
  }

  const handleUmpiresSet = (umpires: { onField: string[]; thirdUmpire: string }) => {
    setFormData({ ...formData, umpires })
    setStep(5)
  }

  const handleOpeningPlayersSet = (openingBatsmen: string[], openingBowler: string) => {
    setFormData({ ...formData, openingBatsmen, openingBowler })
    setStep(6)
  }

  const handleTossSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Create a new match object
    const newMatch = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      venue: formData.venue,
      format: formData.format as 'T20' | 'ODI' | 'Test',
      tossWinner: formData.tossWinner,
      tossDecision: formData.tossDecision as 'bat' | 'field',
      battingTeam: {
        id: '1',
        name: formData.tossDecision === 'bat' ? formData.tossWinner : 
              (formData.tossWinner === formData.team1Name ? formData.team2Name : formData.team1Name),
        players: (formData.tossDecision === 'bat' ? 
          (formData.tossWinner === formData.team1Name ? formData.team1Players : formData.team2Players) :
          (formData.tossWinner === formData.team1Name ? formData.team2Players : formData.team1Players)).map(initializePlayer),
        totalRuns: 0,
        wickets: 0,
        overs: 0,
        currentRunRate: 0,
      },
      bowlingTeam: {
        id: '2',
        name: formData.tossDecision === 'field' ? formData.tossWinner :
              (formData.tossWinner === formData.team1Name ? formData.team2Name : formData.team1Name),
        players: (formData.tossDecision === 'field' ?
          (formData.tossWinner === formData.team1Name ? formData.team1Players : formData.team2Players) :
          (formData.tossWinner === formData.team1Name ? formData.team2Players : formData.team1Players)).map(initializePlayer),
        totalRuns: 0,
        wickets: 0,
        overs: 0,
        currentRunRate: 0,
      },
      currentBatsmen: formData.openingBatsmen,
      currentBowler: formData.openingBowler,
      lastBall: {
        runs: 0,
        wicket: false,
        extras: 0,
      },
      matchStatus: 'not_started' as const,
      umpires: formData.umpires,
      partnerships: [],
      currentPartnership: null,
      powerPlayStats: {
        overs: 0,
        runs: 0,
        wickets: 0,
        runRate: 0,
      },
    }

    dispatch(startNewMatch(newMatch))
    navigate(`/live-scoring/${newMatch.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {step === 1 && (
        <div className="cricket-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Start New Match</h2>
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team 1 Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                value={formData.team1Name}
                onChange={(e) => setFormData({ ...formData, team1Name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Team 2 Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                value={formData.team2Name}
                onChange={(e) => setFormData({ ...formData, team2Name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Venue
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Match Format
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              >
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full cricket-button"
            >
              Continue
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <PlayerSetup
          teamName={formData.team1Name}
          playerCount={11}
          onPlayersSet={handleTeam1PlayersSet}
        />
      )}

      {step === 3 && (
        <PlayerSetup
          teamName={formData.team2Name}
          playerCount={11}
          onPlayersSet={handleTeam2PlayersSet}
        />
      )}

      {step === 4 && (
        <UmpireSetup onUmpiresSet={handleUmpiresSet} />
      )}

      {step === 5 && (
        <div className="cricket-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Opening Players</h2>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleOpeningPlayersSet(formData.openingBatsmen, formData.openingBowler)
          }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Batsmen
              </label>
              <div className="space-y-4">
                {[1, 2].map((num) => (
                  <select
                    key={num}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                    value={formData.openingBatsmen[num - 1] || ''}
                    onChange={(e) => {
                      const newBatsmen = [...formData.openingBatsmen]
                      newBatsmen[num - 1] = e.target.value
                      setFormData({ ...formData, openingBatsmen: newBatsmen })
                    }}
                  >
                    <option value="">Select Batsman {num}</option>
                    {(formData.tossDecision === 'bat' ? 
                      (formData.tossWinner === formData.team1Name ? formData.team1Players : formData.team2Players) :
                      (formData.tossWinner === formData.team1Name ? formData.team2Players : formData.team1Players))
                      .map(player => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                  </select>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opening Bowler
              </label>
              <select
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                value={formData.openingBowler}
                onChange={(e) => setFormData({ ...formData, openingBowler: e.target.value })}
              >
                <option value="">Select Opening Bowler</option>
                {(formData.tossDecision === 'field' ?
                  (formData.tossWinner === formData.team1Name ? formData.team1Players : formData.team2Players) :
                  (formData.tossWinner === formData.team1Name ? formData.team2Players : formData.team1Players))
                  .map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full cricket-button"
            >
              Continue
            </button>
          </form>
        </div>
      )}

      {step === 6 && (
        <div className="cricket-card p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Toss Details</h2>
          <form onSubmit={handleTossSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Toss Winner
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                value={formData.tossWinner}
                onChange={(e) => setFormData({ ...formData, tossWinner: e.target.value })}
              >
                <option value="">Select Team</option>
                <option value={formData.team1Name}>{formData.team1Name}</option>
                <option value={formData.team2Name}>{formData.team2Name}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Toss Decision
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cricket-green focus:ring-cricket-green"
                value={formData.tossDecision}
                onChange={(e) => setFormData({ ...formData, tossDecision: e.target.value })}
              >
                <option value="bat">Bat</option>
                <option value="field">Field</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full cricket-button"
            >
              Start Match
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default NewMatch 