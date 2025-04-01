import * as actionType from '@api/constant/sprint'

interface SprintState {
  sprints: any[]
  loading: boolean
  error: string | null
}

interface SprintAction {
  type: string
  payload?: any
}

const initialState: SprintState = {
  sprints: [],
  loading: false,
  error: null,
}

export default function sprintReducer(
  state: SprintState = initialState,
  action: SprintAction
): SprintState {
  switch (action.type) {
    case actionType.getAllSprints.success:
      return {
        ...state,
        sprints: action.payload,
      }
    // case actionType.getSprint.success:
    //   return {
    //     ...state,
    //     sprints: action.payload,
    //   }
    default:
      return state
  }
}
