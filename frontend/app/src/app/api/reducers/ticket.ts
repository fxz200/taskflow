import * as actionType from '@api/constant/ticket'
import { Ticket } from '@constants/ticket'

interface State {
  tickets: Ticket[]
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
    case actionType.getAllTickets.request:
      return {
        ...state,
        loading: true,
      }
    case actionType.getAllTickets.success:
      return {
        ...state,
        tickets: action.payload.tickets || [],
        loading: false,
      }
    case actionType.getAllTickets.failure:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}