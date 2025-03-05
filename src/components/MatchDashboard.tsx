import React from 'react'
import type { Match, Player } from '../features/matchSlice'
import PlayerSwitcher from './PlayerSwitcher'
import { useDispatch } from 'react-redux'
import { switchBatsman, switchBowler } from '../features/matchSlice'

interface MatchDashboardProps {
  match: Match
}

const MatchDashboard: React.FC<MatchDashboardProps> = ({ match }) => {
  const dispatch = useDispatch()

  const getPlayerById = (team: 'batting' | 'bowling', playerId: string): Player | undefined => {
    const teamPlayers = team === 'batting' ? match.battingTeam.players : match.bowlingTeam.players
    return teamPlayers.find((p: Player) => p.id === playerId)
  }

  const currentBatsman1 = getPlayerById('batting', match.currentBatsmen[0])
  const currentBatsman2 = getPlayerById('batting', match.currentBatsmen[1])
  const currentBowler = getPlayerById('bowling', match.currentBowler)

  return (
    <div className="space-y-6">
      {/* Match Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="cricket-card p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{match.battingTeam.name}</h3>
          <div className="text-3xl font-bold text-cricket-green">
            {match.battingTeam.totalRuns}/{match.battingTeam.wickets}
          </div>
          <div className="text-sm text-gray-600">
            {match.battingTeam.overs.toFixed(1)} overs (RR: {match.battingTeam.currentRunRate.toFixed(2)})
          </div>
        </div>

        <div className="cricket-card p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{match.bowlingTeam.name}</h3>
          <div className="text-3xl font-bold text-cricket-green">
            {match.bowlingTeam.totalRuns}/{match.bowlingTeam.wickets}
          </div>
          <div className="text-sm text-gray-600">
            {match.bowlingTeam.overs.toFixed(1)} overs (RR: {match.bowlingTeam.currentRunRate.toFixed(2)})
          </div>
        </div>
      </div>

      {/* Current Players */}
      <div className="grid grid-cols-2 gap-4">
        {/* Batsmen */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Batsmen</h3>
          {currentBatsman1 && (
            <PlayerSwitcher
              currentPlayer={currentBatsman1}
              availablePlayers={match.battingTeam.players}
              onSwitch={(newId) => dispatch(switchBatsman({ batsmanId: currentBatsman1.id, newBatsmanId: newId }))}
              type="batsman"
              isActive={true}
            />
          )}
          {currentBatsman2 && (
            <PlayerSwitcher
              currentPlayer={currentBatsman2}
              availablePlayers={match.battingTeam.players}
              onSwitch={(newId) => dispatch(switchBatsman({ batsmanId: currentBatsman2.id, newBatsmanId: newId }))}
              type="batsman"
              isActive={true}
            />
          )}
        </div>

        {/* Bowler */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Bowler</h3>
          {currentBowler && (
            <PlayerSwitcher
              currentPlayer={currentBowler}
              availablePlayers={match.bowlingTeam.players}
              onSwitch={(newId) => dispatch(switchBowler({ bowlerId: currentBowler.id, newBowlerId: newId }))}
              type="bowler"
              isActive={true}
            />
          )}
        </div>
      </div>

      {/* Current Partnership */}
      {match.currentPartnership && (
        <div className="cricket-card p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Partnership</h3>
          <div className="text-xl font-medium text-cricket-green">
            {match.currentPartnership.runs} runs ({match.currentPartnership.balls} balls)
          </div>
          <div className="text-sm text-gray-600">
            Run Rate: {((match.currentPartnership.runs / match.currentPartnership.balls) * 6).toFixed(2)}
          </div>
        </div>
      )}

      {/* Power Play Stats */}
      <div className="cricket-card p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Power Play</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Overs</div>
            <div className="text-xl font-medium">{match.powerPlayStats.overs.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Runs</div>
            <div className="text-xl font-medium">{match.powerPlayStats.runs}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Wickets</div>
            <div className="text-xl font-medium">{match.powerPlayStats.wickets}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Run Rate</div>
            <div className="text-xl font-medium">{match.powerPlayStats.runRate.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchDashboard 