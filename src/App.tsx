import { useState } from 'react'
import './App.css'

function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12 // Convert 0 to 12 for 12 AM
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
}

function App() {
  const [weeklyTargetHours, setWeeklyTargetHours] = useState('40')
  const [weeklyTargetMinutes, setWeeklyTargetMinutes] = useState('0')
  const [clockedHours, setClockedHours] = useState('0')
  const [clockedMinutes, setClockedMinutes] = useState('0')
  const [lastClockIn, setLastClockIn] = useState('')
  const [clockOutTime, setClockOutTime] = useState<string | null>(null)

  const handleCalculate = () => {
    if (!lastClockIn) {
      setClockOutTime(null)
      return
    }

    // Parse inputs
    const target = parseInt(weeklyTargetHours) * 60 + parseInt(weeklyTargetMinutes)
    const clocked = parseInt(clockedHours) * 60 + parseInt(clockedMinutes)
    const remaining = Math.max(target - clocked, 0)

    // Parse last clock in time
    const [inHour, inMinute] = lastClockIn.split(":").map(Number)
    
    // Create a new date object for the clock out time
    const clockOut = new Date()
    clockOut.setHours(inHour, inMinute, 0, 0)
    
    // Add the remaining minutes to get the clock out time
    const totalMinutes = inHour * 60 + inMinute + remaining
    const outHour = Math.floor(totalMinutes / 60) % 24
    const outMinute = totalMinutes % 60
    
    setClockOutTime(formatTime(outHour, outMinute))
  }

  return (
    <div className="container">
      <h1>Clock Out Time Calculator</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          handleCalculate()
        }}
        className="form"
      >
        <div className="form-group">
          <label>Weekly Target:</label>
          <input type="number" min="0" max="167" value={weeklyTargetHours} onChange={e => setWeeklyTargetHours(e.target.value)} />
          <span>hours</span>
          <input type="number" min="0" max="59" value={weeklyTargetMinutes} onChange={e => setWeeklyTargetMinutes(e.target.value)} />
          <span>minutes</span>
        </div>
        <div className="form-group">
          <label>Already Clocked:</label>
          <input type="number" min="0" max="167" value={clockedHours} onChange={e => setClockedHours(e.target.value)} />
          <span>hours</span>
          <input type="number" min="0" max="59" value={clockedMinutes} onChange={e => setClockedMinutes(e.target.value)} />
          <span>minutes</span>
        </div>
        <div className="form-group">
          <label>Last Clock In:</label>
          <input type="time" value={lastClockIn} onChange={e => setLastClockIn(e.target.value)} className="time-input" />
        </div>
        <button type="submit">Calculate Clock Out Time</button>
      </form>
      {clockOutTime && (
        <div className="result">
          <h2>You should clock out at:</h2>
          <p className="clock-out-time">{clockOutTime}</p>
          <a href='http://www.atokansas.com'></a>
        </div>
      )}
    </div>

  )
}

export default App
