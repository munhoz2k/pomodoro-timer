import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'

import { HandPalm, Play } from 'phosphor-react'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  StopCountDownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  owner: zod.string().optional(),
  minutesAmount: zod
    .number()
    .min(1, 'A atividade não pode ser menor que 5 minutos')
    .max(60, 'A atividade não pode ser maior que 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startData: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassedAmount, setSecondsPassedAmount] = useState(0)

  const activeCycle = cycles.find((cycle) => activeCycleId === cycle.id)

  // Time (Minutes/Seconds) Calcs
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - secondsPassedAmount : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startData,
        )

        if (secondsDifference >= totalSeconds) {
          setCycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          clearInterval(interval)

          setActiveCycleId(null)
          setSecondsPassedAmount(0)
        } else {
          setSecondsPassedAmount(secondsDifference)
        }
      }, 1000)

      document.title = `${minutes}:${seconds}`
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, minutes, seconds])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startData: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setSecondsPassedAmount(0)

    reset()
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  // Entry Verification
  const task = watch('task')
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Atividade:</label>
          <TaskInput
            id="task"
            list="task-suggestion"
            placeholder="Atividade a ser realizada"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestion">
            <option value="Opc. 1" />
            <option value="Opc. 2" />
            <option value="Opc. 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">Tempo</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={1}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <StopCountDownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountDownButton>
        ) : (
          <StartCountDownButton disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
