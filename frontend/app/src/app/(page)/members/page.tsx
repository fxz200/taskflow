'use client'
import { getAllMembers } from '@api/actions/member'
import MemberDialog from './components/MemberDialog'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Button, Card, Divider } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import MemberCard from './components/MemberCard'

const Members = () => {
  const dispatch = useAppDispatch()
  const members = useAppSelector((state) => state.member?.members)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (!members || members.length === 0) {
      dispatch(getAllMembers())
    }
  }, [])

  const PMList = members?.filter((member) => member.role === 1) || []
  const BEList = members?.filter((member) => member.role === 2) || []
  const FEList = members?.filter((member) => member.role === 3) || []
  const QAList = members?.filter((member) => member.role === 4) || []

  return (
    <>
      <div className="flex mr-8 h-full">
        {members.length > 0 ? (
          <Card
            radius="sm"
            shadow="none"
            className="flex flex-col bg-primary/60 rounded-tl-3xl rounded-br-3xl w-full py-12 mb-8 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)] max-h-[80vh]"
          >
            <div className="px-[60px] mr-2 overflow-y-auto">
              {PMList.length > 0 && (
                <>
                  <p className="font-light text-2xl">PM</p>
                  <div className="flex flex-row flex-wrap gap-x-32 mt-4 mx-4">
                    {PMList?.map((member) => {
                      return <MemberCard member={member} key={member.id} />
                    })}
                  </div>
                  {(BEList.length > 0 ||
                    FEList.length > 0 ||
                    QAList.length > 0) && <Divider className="mb-4" />}
                </>
              )}
              {BEList.length > 0 && (
                <>
                  <p className="font-light text-2xl">BE</p>
                  <div className="flex flex-row flex-wrap gap-x-32 mt-4 mx-4">
                    {BEList?.map((member) => {
                      return <MemberCard member={member} key={member.id} />
                    })}
                  </div>
                  {(FEList.length > 0 || QAList.length > 0) && (
                    <Divider className="mb-4" />
                  )}
                </>
              )}
              {FEList.length > 0 && (
                <>
                  <p className="font-light text-2xl">FE</p>
                  <div className="flex flex-row flex-wrap gap-x-32 mt-4 mx-4">
                    {FEList?.map((member) => {
                      return <MemberCard member={member} key={member.id} />
                    })}
                  </div>
                  {(QAList.length > 0) && (
                    <Divider className="mb-4" />
                  )}
                </>
              )}
              {QAList.length > 0 && (
                <>
                  <p className="font-light text-2xl">QA</p>
                  <div className="flex flex-row flex-wrap gap-x-32 mt-4 mx-4">
                    {QAList?.map((member) => {
                      return <MemberCard member={member} key={member.id} />
                    })}
                  </div>
                </>
              )}
            </div>
          </Card>
        ) : (
          <Card
            radius="sm"
            className="flex items-center justify-center bg-primary/60 rounded-tl-3xl rounded-br-3xl w-full mb-8 shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <Button
              radius="sm"
              className="flex flex-col items-center justify-center bg-white/90 rounded-tl-3xl rounded-br-3xl h-36 w-60 border-dashed border-2 border-primary"
              onPress={() => setOpenDialog(true)}
            >
              <div>
                <PlusIcon className="w-18 h-14" />
              </div>
              <p className="font-light text-xl text-black">新增會員</p>
            </Button>
          </Card>
        )}
      </div>
      <MemberDialog isOpen={openDialog} setIsOpen={setOpenDialog} />
    </>
  )
}

export default Members
