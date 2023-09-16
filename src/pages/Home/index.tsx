import { Play } from 'phosphor-react'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  TaskInput,
} from './styles'

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Atividade:</label>
          <TaskInput
            id="task"
            list="task-suggestion"
            placeholder="Atividade a ser realizada"
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
            step={5}
            min={5}
            max={120}
          />

          <span>minutos</span>
        </FormContainer>

        <CountDownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountDownButton disabled type="submit">
          <Play size={24} />
          Começar
        </StartCountDownButton>
      </form>
    </HomeContainer>
  )
}
