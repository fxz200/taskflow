'use client'
import { Member } from '@constants/member'
import React from 'react'

interface TicketMembersProps {
  label: string
  members: Member[]
  className?: string
}

const TicketMembers = ({
  label,
  members,
  className = '',
}: TicketMembersProps) => {
  return (
    <div className={`flex items-center ${className}`}>
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
