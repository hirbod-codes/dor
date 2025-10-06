import { createContext } from "react";

export const AppContext = createContext<{ eachTurnDurationSeconds: number, maxTurns: number, wordsCategory: string } | undefined>(undefined);
