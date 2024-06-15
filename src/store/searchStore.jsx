import { create } from 'zustand'

const useSearchStore = create((set) => ({
    search: '',
    filter: { value: "1", label: "Código" },
    setSearch: (search, filter) => set( (state) => ({ search, filter: filter ? filter : state.filter }))
}))

export default useSearchStore