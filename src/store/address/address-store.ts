import { Address } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  address: Address;

  // methods

  setAddress: (address: State["address"]) => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set, get) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        postalCode: "",
        city: "",
        phone: "",
      },
      setAddress: (address) => {
        set({ address });
      },
    }),
    {
      name: "address-storage",
    }
  )
);
