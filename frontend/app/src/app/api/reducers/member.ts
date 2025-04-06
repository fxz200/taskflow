import * as actionType from '@api/constant/member'

interface State {
  members: any[]
  loading: boolean
  error: string | null
}

interface Action {
  type: string
  payload?: any
}

const initialState: State = {
  members: [],
  loading: false,
  error: null,
}

export default function memberReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case actionType.getAllMembers.success:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
