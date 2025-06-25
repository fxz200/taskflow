'use client'
import { Member } from '@constants/member'
import React from 'react'

interface TicketMembersProps {
  label: string
  members: Member[]
  rowStart?: number
}

const TicketMembers = ({
  label,
  members,
  rowStart = 2,
}: TicketMembersProps) => {
  return (
    <div className={`row-start-${rowStart} col-start-2 flex items-center`}>
      <span>{label}</span>
      <div className="flex items-center ml-1">
        {members.map((member) => (
          <div key={member.id}>
            <span className="text-sm text-gray-500">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TicketMembers
