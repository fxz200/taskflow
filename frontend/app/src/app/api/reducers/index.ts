import { combineReducers } from '@reduxjs/toolkit'
import sprintReducer from './sprint'
import memberReducer from './member'

const rootReducer = combineReducers({
  sprint: sprintReducer,
  member: memberReducer,
})

export default rootReducer