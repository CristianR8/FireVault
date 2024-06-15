import { create } from 'zustand'

const useAddProductStore = create((set) => ({
    hv: {},
    rps: {},
    data: {},
    setHv: (hv) => set( () => ({ hv })),
    setRps: (rps) => set( () => ({ rps })),
    setData: (data) => set( () => ({ data })),
}))

export default useAddProductStore