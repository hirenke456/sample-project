import React, { useState } from 'react'
import type { Player } from '../features/matchSlice'

interface PlayerSwitcherProps {
  currentPlayer: Player
  availablePlayers: Player[]
  onSwitch: (newPlayerId: string) => void
  type: 'batsman' | 'bowler'
  isActive?: boolean
}

const PlayerSwitcher: React.FC<PlayerSwitcherProps> = ({
  currentPlayer,
  availablePlayers,
  onSwitch,
  type,
  isActive = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPlayers = availablePlayers.filter(player => 
    player.id !== currentPlayer.id &&
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSwitch = (playerId: string) => {
    onSwitch(playerId)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <div
        className={`cricket-card p-4 cursor-pointer transition-colors ${
          isActive ? 'bg-cricket-green/10 border-cricket-green' : 'hover:bg-gray-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-900">{currentPlayer.name}</h4>
            <p className="text-sm text-gray-500">
              {type === 'batsman' 
                ? `${currentPlayer.runs} (${currentPlayer.balls})`
                : `${currentPlayer.wickets}/${currentPlayer.runs} (${currentPlayer.overs.toFixed(1)})`
              }
            </p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isActive ? 'bg-cricket-green text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {type === 'batsman' ? 'Batting' : 'Bowling'}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cricket-green"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredPlayers.map(player => (
              <div
                key={player.id}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSwitch(player.id)}
              >
                <div className="font-medium text-gray-900">{player.name}</div>
                <div className="text-sm text-gray-500">
                  {type === 'batsman'
                    ? `${player.runs} (${player.balls})`
                    : `${player.wickets}/${player.runs} (${player.overs.toFixed(1)})`
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerSwitcher 