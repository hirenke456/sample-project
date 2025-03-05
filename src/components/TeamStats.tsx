import React from 'react'
import type { Team, Player } from '../features/matchSlice'

interface TeamStatsProps {
  team: Team
  isBatting: boolean
}

const TeamStats: React.FC<TeamStatsProps> = ({ team, isBatting }) => {
  const sortedPlayers = [...team.players].sort((a, b) => {
    if (isBatting) {
      return b.runs - a.runs
    } else {
      return b.wickets - a.wickets
    }
  })

  return (
    <div className="cricket-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-cricket-green">
            {team.totalRuns}/{team.wickets}
          </div>
          <div className="text-sm text-gray-600">
            {team.overs.toFixed(1)} overs (RR: {team.currentRunRate.toFixed(2)})
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Player
              </th>
              {isBatting ? (
                <>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runs
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balls
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SR
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    4s/6s
                  </th>
                </>
              ) : (
                <>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overs
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wickets
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runs
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Econ
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedPlayers.map((player) => (
              <tr key={player.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {player.name}
                </td>
                {isBatting ? (
                  <>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.runs}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.balls}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.strikeRate.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.fours}/{player.sixes}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.overs.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.wickets}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.runs}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                      {player.economy.toFixed(2)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TeamStats 