import * as actionType from '@api/constant/ticket'

interface State {
  tickets: any[]
  loading: boolean
  error: string | null
}

interface Action {
  type: string
  payload?: any
}

const initialState: State = {
  tickets: [],
  loading: false,
  error: null,
}

export default function ticketReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case actionType.getTickets.request:
      return {
        ...state,
        loading: true,
      }
    case actionType.getTickets.success:
      return {
        ...state,
        tickets: action.payload,
        loading: false,
      }
    case actionType.getTickets.failure:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}