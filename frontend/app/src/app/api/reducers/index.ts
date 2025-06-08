import { combineReducers } from '@reduxjs/toolkit'
import sprintReducer from './sprint'
import memberReducer from './member'
import ticketReducer from './ticket'

const rootReducer = combineReducers({
  sprint: sprintReducer,
  member: memberReducer,
  ticket: ticketReducer,
})

export default rootReducer