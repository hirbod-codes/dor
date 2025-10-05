import { useContext, useReducer, useRef, useState } from "react"
import { type Transition, motion } from 'framer-motion'
import type { Team } from "./types"
import { Button } from "./shadcn/ui/button"
import animals from '@/words/animals.json'
import { DateTime } from 'luxon'
import CountDownClock from "./CountDownClock"
import Teammate from "./Teammate"
import { AppContext } from "@/context"
import { Input } from "./shadcn/ui/input"

const transition: Transition = {
    duration: 1,
    ease: "easeInOut",
}

function Game({ teams, setTeams, finish }: { teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>>, finish: () => void }) {
    const appContext = useContext(AppContext)!

    const eachTurnDurationSeconds = appContext.eachTurnDurationSeconds

    const [words, _setWords] = useState(animals)

    const startedAt = useRef(0)
    const turns = useRef(0)

    let angle = 360 / (teams.length * 2) // Since each team has two members

    const controlsRef = useRef<Map<number, any[]>>(new Map)

    const register = (i: number, controls: any[]) => {
        controlsRef.current.set(i, controls)
    }

    const unregister = (i: number) => {
        controlsRef.current.delete(i)
    }

    const timer = useRef<number | undefined>(undefined)

    const startTimer = (callback: (() => Promise<void>) | (() => void)) => {
        if (timer.current !== undefined)
            throw new Error('can\'t start the timer, timer\'s ref value is not undefined')

        startedAt.current = DateTime.utc().toUnixInteger()

        timer.current = setInterval(async () => {
            await callback()
        }, eachTurnDurationSeconds * 1000)
    }

    const stopTimer = () => {
        if (timer.current === undefined)
            return
        clearInterval(timer.current)
        timer.current = undefined
    }

    const rotate = () => {
        if (turns.current >= appContext?.maxTurns) {
            teams.sort((a, b) => a.score - b.score)
            showResult()
            return
        }

        turns.current += 1

        // let angle = 360 / (teams.length * 2) // Since each team has two members
        controlsRef.current.forEach((cs, i) => {
            cs[0].start({
                offsetDistance: `${(((i * angle) + 90 + (turns.current * angle)) / 360) * 100}%`,
                transition
            })
            cs[1].start({
                offsetDistance: `${(((i * angle) + 270 + (turns.current * angle)) / 360) * 100}%`,
                transition
            })
        })
    }

    const [showingResult, setShowingResult] = useState(false)
    const showResult = () => {
        setShowingResult(true)
    }

    const initialState = { playing: false };

    function reducer(_state: any, action: any) {
        switch (action.type) {
            case 'start':
                if (timer.current !== undefined)
                    stopTimer()

                startTimer(() => {
                    console.log('tick')
                    dispatch({ type: 'timeout' })
                })

                return { playing: true };
            case 'timeout':
                stopTimer()
                return { playing: false };
            case 'wordClicked':
                startTimer(() => {
                    console.log('tick')
                    dispatch({ type: 'timeout' })
                })

                return { playing: true };
            default:
                throw new Error('Invalid operation dispatched.')
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    console.log('Game', { timer: timer.current, startedAt: startedAt.current, state, turns: turns.current, teams })

    if (teams.length < 2)
        return (<>
            <div className="text-foreground">
                Invalid number of teams!
            </div>
        </>)
    else
        return (
            <>
                <div className="w-full h-full p-2">
                    {state.playing && <CountDownClock durationSeconds={eachTurnDurationSeconds} resetRef={turns.current} />}

                    {teams.map((t, i) =>
                        <Teammate key={angle + i} angle={angle} index={i} team={t} registerControls={register} unregisterControls={unregister} />
                    )}

                    {!state.playing &&
                        <Button className="top-1/2 left-1/2 absolute -translate-x-[50%] -translate-y-[50%]" onClick={() => {
                            // To do: fetch words
                            dispatch({ type: 'start' })
                        }}>
                            Start
                        </Button>
                    }

                    {state.playing &&
                        <div
                            className="top-1/2 left-1/2 absolute -translate-x-[50%] -translate-y-[50%] rounded-full w-[25%] h-[25%]"
                            onClick={() => {
                                stopTimer()

                                rotate()

                                // Add score
                                teams[turns.current % teams.length].score += DateTime.utc().toUnixInteger() - startedAt.current
                                setTeams([...teams])

                                startTimer(() => {
                                    console.log('tick')
                                    dispatch({ type: 'timeout' })
                                })
                            }}
                        >
                            <div className="top-1/2 left-1/2 absolute -translate-x-[50%] -translate-y-[50%] pointer-events-none cursor-pointer">
                                {words[turns.current % words.length]}
                            </div>
                        </div>
                    }

                    <Button className="my-2" onClick={() => setShowingResult(!showingResult)}>result</Button>
                </div>

                {showingResult &&
                    <motion.div
                        className="absolute h-full w-full bg-background p-4 flex flex-col gap-8 overflow-y-auto"
                        initial={{ bottom: '-100%' }}
                        animate={{ bottom: showingResult ? '0%' : '-100%' }}
                        exit={{ bottom: '-100%' }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    >
                        {teams.map((t, i) =>
                            <div key={i} className="flex flex-row items-center gap-2">
                                <div className="text-xl">
                                    {`Score: ${t.score}`}
                                </div>
                                <Input value={t.members[0]} />
                                <Input value={t.members[1]} />
                            </div>
                        )}

                        <Button className="my-2" onClick={() => finish()}>Home</Button>
                    </motion.div>
                }
            </>
        )
}

export default Game
