import React, { Fragment, SVGProps } from "react"
import { useForm } from "react-hook-form"
import { differenceInCalendarDays } from "date-fns"
import { Menu, Transition } from "@headlessui/react";

import { usePersistedState } from "../UsePersistedState"
import classNames from "classnames";

interface Item {
  id: string
  name: string
  date: string
}

interface FormValues {
  name: string
  date: string
}

const NewItem = ({ ok }: { ok: (x: FormValues) => void }) => {
  const { register, handleSubmit } = useForm<FormValues>()

  return (
    <form
      className="flex flex-col space-y-1"
      onSubmit={handleSubmit(ok)}
    >
      <input type="text" {...register("name")} />
      <input type="date" {...register("date")} />
      <button
        className="bg-blue-600 text-white p-2 rounded-md font-medium"
        type="submit"
      >
        Add
      </button>
    </form>
  )
}

const More = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

const ItemComp = ({ item: { date, name, id }, del }: {
  item: Item
  del: (x: string) => void
}) => {
  const diff = differenceInCalendarDays(new Date(date), new Date())
  return (
    <div className="flex flex-row items-center">
      <div>
        {Math.abs(diff)} days {diff > 0 ? 'before' : 'since'} {name}
      </div>
      <Menu as="div" className="relative inline-block text-left">{
        ({ open }) => (
          <>
            <Menu.Button className="w-12 h-12 flex justify-center items-center">
              <More />
            </Menu.Button>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames('flex rounded-md items-center w-full px-2 py-2 text-sm', {
                        'bg-purple-500 text-white': active,
                        'text-gray-900': !active,
                      })}
                      onClick={() => del(id)}
                    >
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )
      }</Menu>
    </div>
  )
}

// noinspection JSUnusedGlobalSymbols
export default function Index(): JSX.Element {

  const [list, setList] = usePersistedState<ReadonlyArray<Item>>('list', [])

  const ok = (x: FormValues) => {
    const y = {
      id: Math.random().toString(36).substring(2),
      ...x,
    }
    setList(list => ([...list, y]))
  }

  const del = (toDelete: string) => {
    setList(list => list.filter(({ id }) => id !== toDelete))
  }

  return (
    <div className="flex flex-col">
      <NewItem
        ok={ok}
      />

      {list.map(x => (
        <ItemComp
          key={x.id}
          item={x}
          del={del}
        />
      ))}
    </div>
  )
}
