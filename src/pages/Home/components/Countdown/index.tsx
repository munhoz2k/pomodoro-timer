import { useContext, useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'
import { CountdownContainer, Separator } from './styles'
import { CyclesContext } from '../../../../context/CyclesContext'

export function Countdown() {
  const { activeCycle, secondsPassedAmount, finishCycle, setSecondsPassed } =
    useContext(CyclesContext)

  // Time (Minutes/Seconds) Calcs
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - secondsPassedAmount : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          finishCycle()
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
          document.title = `${minutes}:${seconds}`
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    setSecondsPassed,
    finishCycle,
    activeCycle,
    totalSeconds,
    minutes,
    seconds,
  ])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
