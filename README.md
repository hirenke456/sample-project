# Cricket Scoring App

A modern, feature-rich cricket scoring application built with React, TypeScript, and Redux Toolkit. This app helps cricket scorers and enthusiasts keep track of matches with detailed statistics and real-time updates.

## Features

### Match Setup
- Create new matches with team details
- Add players for both teams (11 players per team)
- Set up match officials (on-field umpires and third umpire)
- Configure opening batsmen and bowlers
- Record toss details (winner and decision)

### Live Scoring
- Track runs, wickets, and extras
- Monitor individual player statistics
- Record detailed batting and bowling figures
- Track partnerships between batsmen
- Monitor power play statistics
- Switch between players during the match

### Statistics Tracking
- Batting statistics:
  - Runs scored
  - Balls faced
  - Strike rate
  - Fours and sixes
  - Dot balls faced
- Bowling statistics:
  - Overs bowled
  - Wickets taken
  - Runs conceded
  - Economy rate
  - Maidens
  - Wides and no-balls
  - Dot balls

### Match Formats
- Support for multiple cricket formats:
  - T20
  - ODI
  - Test

### Additional Features
- Real-time run rate calculation
- Partnership tracking
- Power play statistics
- Match state persistence
- Player switching functionality
- Detailed team statistics display

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cricket-scoring-app.git
```

2. Navigate to the project directory:
```bash
cd cricket-scoring-app
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The app will open in your default browser at `http://localhost:3000`.

## Usage

1. **Starting a New Match**
   - Click "New Match" to begin
   - Enter team names and venue
   - Select match format
   - Add players for both teams
   - Set up match officials
   - Configure opening players
   - Record toss details

2. **Scoring the Match**
   - Use the scoring interface to record each ball
   - Track runs, wickets, and extras
   - Switch between players as needed
   - Monitor real-time statistics

3. **Viewing Statistics**
   - Check team totals and run rates
   - View individual player statistics
   - Monitor partnerships
   - Track power play performance

## Technologies Used

- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- React Router

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Cricket statistics and rules based on standard cricket scoring practices
- UI/UX inspired by professional cricket scoring applications
