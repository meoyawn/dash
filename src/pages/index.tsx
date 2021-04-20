import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

interface Item {
  id: string
  name: string
  date: Date
}

const usePersistedState = <T, >(key: string, defaultValue: T): [val: T, set: Dispatch<SetStateAction<T>>] => {

  const [state, setState] = useState(defaultValue)

  useEffect(() => {
    const x = localStorage.getItem(key)
    if (x) {
      setState(JSON.parse(x))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

// noinspection JSUnusedGlobalSymbols
export default function Index(): JSX.Element {

  const [list, setList] = usePersistedState('list', [])

  return (
    <div>
      <form className="flex flex-col space-y-1">
        <input type="text" />
        <input type="date" />
        <button
          className="bg-blue-600 text-white p-2 rounded-md font-medium"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  )
}
