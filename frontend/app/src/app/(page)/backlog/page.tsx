'use client'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import {
  TABLE_COLUMNS,
  Ticket,
  TICKET_PRIORITIES,
  TICKET_STATEMENTS,
  TICKET_TYPES,
} from '@constants/ticket'
import TicketDialog from '@components/ticket/TicketDialog'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getAllTickets, putTicket } from '@api/actions/ticket'
import {
  ArrowUturnRightIcon,
  PencilIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { PlusIcon } from '@heroicons/react/24/solid'
interface BacklogProps {
  selectedTableKeys: string[]
  setSelectedTableKeys: (keys: string[]) => void
}

const Backlog = ({ selectedTableKeys, setSelectedTableKeys }: BacklogProps) => {
  const dispatch = useAppDispatch()
  const allTickets = useAppSelector((state) => state?.ticket?.tickets)
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditTicket, setIsEditTicket] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

  useEffect(() => {
    if (!allTickets || allTickets.length === 0) {
      dispatch(getAllTickets())
    }
  }, [])

  return (
    <>
      <div className="flex mr-8 h-full">
        <Table
          aria-label="Example static collection table"
          color="default"
          radius="lg"
          shadow="none"
          selectionMode="multiple"
          selectedKeys={selectedTableKeys}
          onSelectionChange={(keys) => {
            if (keys === 'all') {
              setSelectedTableKeys(allTickets.map((t: Ticket) => t.id))
            } else {
              setSelectedTableKeys(Array.from(keys as Set<string>))
            }
          }}
          classNames={{
            wrapper: 'shadow-[4px_4px_4px_0_rgba(0,0,0,0.25)] h-full mb-8 ',
            table: allTickets.length === 0 ? 'h-full' : '',
            tbody: '',
            tr: 'bg-primary-100 data-[hover=true]:!opacity-100 hover:bg-primary-50',
            th: 'bg-primary-200 text-center',
            td: `${
              allTickets.length === 0 ? 'flex w-full h-full' : 'text-center'
            } font-light`,
            tfoot: '',
            emptyWrapper: '',
          }}
        >
          <TableHeader>
            {TABLE_COLUMNS.map((column) => (
              <TableColumn
                key={column.key}
                className={
                  column.key === 'name' || column.key === 'type'
                    ? 'text-left'
                    : 'text-center'
                }
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="flex items-center justify-center mb-3">
                <Button
                  radius="sm"
                  className="flex items-center justify-center bg-primary rounded-tl-3xl rounded-br-3xl h-14 w-40"
                  onPress={() => setOpenDialog(true)}
                >
                  <PlusIcon className="w-18 h-14" />
                  <p className="font-light text-xl text-black">新增Ticket</p>
                </Button>
              </div>
            }
          >
            {allTickets?.map((row) => (
              <>
                <TableRow key={row.id}>
                  <TableCell>
                    <span
                      className={`rounded-lg px-3 ${
                        row.statement === 0
                          ? 'bg-[#484848] text-white'
                          : row.statement === 1
                          ? 'bg-[#FFCB6C] text-black'
                          : row.statement === 2
                          ? 'bg-[#9FDB6E] text-black'
                          : 'bg-white text-black'
                      }`}
                    >
                      {TICKET_STATEMENTS[row.statement]?.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    {TICKET_TYPES[row.type]?.label}
                  </TableCell>
                  <TableCell className="text-left">{row.title}</TableCell>
                  <TableCell className="text-center">
                    {TICKET_PRIORITIES[row.priority]?.label}
                  </TableCell>
                  <TableCell>{row.sprint}</TableCell>
                  <TableCell>
                    {row.members.find((member) => member.role === 1)?.name ||
                      ''}
                  </TableCell>
                  <TableCell className="flex items-center justify-center">
                    <Button
                      className="bg-transparent min-w-4 px-2"
                      onPress={() => {
                        setIsEditTicket(true)
                        setCurrentTicket(row)
                        setOpenDialog(true)
                      }}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Popover
                      key={row.id}
                      placement="bottom"
                      isOpen={openPopoverId === row.id}
                      onOpenChange={(isOpen) => {
                        setOpenPopoverId(isOpen ? row.id : null)
                      }}
                    >
                      <PopoverTrigger>
                        <Button className="bg-transparent min-w-4 px-2">
                          <ArrowUturnRightIcon className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="text-left">
                        <Button
                          className="w-full bg-transparent"
                          onPress={() => {
                            const payload = { ...row, statement: 1, status: 1 }
                            setOpenPopoverId(null)
                            dispatch(putTicket({ body: payload }))
                          }}
                        >
                          排進priority
                        </Button>
                        <Button
                          className="w-full bg-transparent"
                          onPress={() => {
                            const payload = { ...row, statement: 2 }
                            setOpenPopoverId(null)
                            dispatch(putTicket({ body: payload }))
                          }}
                        >
                          排進sprint
                        </Button>
                      </PopoverContent>
                    </Popover>
                    <Button
                      className="bg-transparent min-w-6 px-2"
                      onPress={() => {
                        setExpandedRow(expandedRow === row.id ? null : row.id)
                      }}
                    >
                      <ChevronDownIcon
                        className={`w-6 h-6 ${
                          expandedRow === row.id ? 'rotate-180' : ''
                        }`}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRow === row.id && (
                  <TableRow className="bg-default-300">
                    <TableCell colSpan={1} className="text-base">
                      描述
                    </TableCell>
                    <TableCell colSpan={6} className="text-left text-sm">
                      {row.summary}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
      <TicketDialog
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
        isEdit={isEditTicket}
        initialData={currentTicket || undefined}
      />
    </>
  )
}

export default Backlog
