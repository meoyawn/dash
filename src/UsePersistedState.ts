import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const usePersistedState = <T, >(key: string, defaultValue: T): [val: T, set: Dispatch<SetStateAction<T>>] => {

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
