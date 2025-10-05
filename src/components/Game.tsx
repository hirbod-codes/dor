import { useReducer, useRef, useState } from "react"
import { type Transition } from 'framer-motion'
import type { Team } from "./types"
import { Button } from "./shadcn/ui/button"
import animals from '@/words/animals.json'
import { DateTime } from 'luxon'
import CountDownClock from "./CountDownClock"
import Teammate from "./Teammate"

const transition: Transition = {
    duration: 1,
    ease: "easeInOut",
}

function Game({ teams, setTeams, eachTurnDurationSeconds = 5, finish }: { teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>>, eachTurnDurationSeconds?: number, finish: () => void }) {
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
            <div className="w-full h-full p-2">
                <Button className="my-2" onClick={() => finish()}>End</Button>

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
            </div>
        )
}

export default Game
