import { createContext } from "react";

export const AppContext = createContext<{ eachTurnDurationSeconds: number, maxTurns: number } | undefined>(undefined);
