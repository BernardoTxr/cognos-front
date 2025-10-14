// TrilhaContext.tsx
import React, { createContext, useContext, useState } from "react";
import {AreaInterface, TrilhaContextType} from "../types/lessons";

const TrilhaContext = createContext<TrilhaContextType | undefined>(undefined);

export const TrilhaProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultTrilha = { id: 2, nome: "biologia", friendly_name: "Biologia" };
  const defaultMacro = { id: 2, nome: "bioquimica", friendly_name: "Bioquímica" };

  const [selectedTrilha, setSelectedTrilha] = useState<AreaInterface>(defaultTrilha);
  const [selectedMacro, setSelectedMacro] = useState<AreaInterface>(defaultMacro);

  return (
    <TrilhaContext.Provider
      value={{
        selectedTrilha,
        setSelectedTrilha,
        selectedMacro,
        setSelectedMacro,
      }}
    >
      {children}
    </TrilhaContext.Provider>
  );
};

export function useTrilha() {
  const context = useContext(TrilhaContext);
  if (!context) throw new Error("useTrilha deve ser usado dentro de TrilhaProvider");
  return context;
}