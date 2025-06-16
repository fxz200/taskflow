import * as actionType from '@api/constant/sprint'
import { Sprint } from '@constants/sprint'

interface State {
  sprints: Sprint[]
  loading: boolean
  error: string | null
}

interface Action {
  type: string
  payload?: any
}

const initialState: State = {
  sprints: [],
  loading: false,
  error: null,
}

export default function sprintReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case actionType.getAllSprints.success:
      return {
        ...state,
        sprints: action.payload.sprints || [],
      }
    default:
      return state
  }
}
