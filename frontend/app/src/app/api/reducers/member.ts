import * as actionType from '@api/constant/member'
import { Member } from '@constants/member'

interface State {
  members: Member[]
  PMList: Member[]
  BEList: Member[]
  FEList: Member[]
  QAList: Member[]
  loading: boolean
  error: string | null
}

interface Action {
  type: string
  payload?: any
}

const initialState: State = {
  members: [],
  PMList: [],
  BEList: [],
  FEList: [],
  QAList: [],
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
        members: action.payload?.members || [],
        PMList: (action.payload?.members || []).filter(
          (member: Member) => member.role === 1
        ),
        BEList: (action.payload?.members || []).filter(
          (member: Member) => member.role === 2
        ),
        FEList: (action.payload?.members || []).filter(
          (member: Member) => member.role === 3
        ),
        QAList: (action.payload?.members || []).filter(
          (member: Member) => member.role === 4
        ),
      }
    default:
      return state
  }
}
