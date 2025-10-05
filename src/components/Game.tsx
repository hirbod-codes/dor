import { Fragment, useEffect, useRef, useState } from "react"
import { motion, useAnimation, type Transition } from 'framer-motion'
import type { Team } from "./types"
import { Button } from "./shadcn/ui/button"
import animals from '@/words/animals.json'
import { DateTime } from 'luxon'

const transition: Transition = {
    duration: 1,
    ease: "easeInOut",
}

function Game({ teams, setTeams, eachTurnDurationSeconds = 5, finish }: { teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>>, eachTurnDurationSeconds?: number, finish: () => void }) {
    let controls: any[] = []

    const [playing, setPlaying] = useState(false)
    const [words, _setWords] = useState(animals)

    const startedAt = useRef(0)
    const turns = useRef(0)

    let angle = 360 / (teams.length * 2) // Since each team has two members
    teams.map((_, i) => {
        // let diffRadians = (270 + (angle * i)) / 180
        // console.log(i, `angle is: ${angle}, angle in radians: ${diffRadians} or ${(180 * diffRadians)}, cos: ${Math.cos(diffRadians)}, sin: ${Math.sin(diffRadians)}`)
        controls[i] = [useAnimation(), useAnimation()]
    })

    const firstTick = useRef(true)
    const timer = useRef<number | undefined>(undefined)

    const startTimer = (callback: (() => Promise<void>) | (() => void)) => {
        if (timer.current !== undefined)
            throw new Error('can\'t start the timer, timer\'s ref value is not undefined')

        startedAt.current = DateTime.utc().toUnixInteger()

        timer.current = setInterval(async () => {
            if (firstTick.current)
                firstTick.current = false
            else {
                if (DateTime.utc().toUnixInteger() - startedAt.current < 1)
                    throw new Error('too short tick period')

                await callback()
            }
        }, eachTurnDurationSeconds * 1000)
    }

    const stopTimer = () => {
        clearInterval(timer.current)
        timer.current = undefined
        firstTick.current = true
    }

    const rotate = () => {
        turns.current += 1

        controls.map((cs, i) => {
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

    useEffect(() => {
        console.log(`playing state has changed: ${playing}`)

        if (playing === true) {
            if (timer.current !== undefined)
                stopTimer()

            startTimer(() => {
                console.log('tick')
                setPlaying(false)
            })
        } else
            stopTimer()
    }, [playing])

    console.log('Game', { firstTick: firstTick.current, timer: timer.current, startedAt: startedAt.current, playing, turns: turns.current })

    return (
        <div className="w-full h-full p-2">
            <Button onClick={() => {
                turns.current += 1

                controls.map((cs, i) => {
                    cs[0].start({
                        offsetDistance: `${(((i * angle) + 90 + (turns.current * angle)) / 360) * 100}%`,
                        transition
                    })
                    cs[1].start({
                        offsetDistance: `${(((i * angle) + 270 + (turns.current * angle)) / 360) * 100}%`,
                        transition
                    })
                })
            }}>Start</Button>

            {teams.map((t, i) =>
                <Fragment key={i}>
                    <motion.div
                        className="absolute border-2 border-red-500"
                        initial={{ offsetRotate: '360deg', offsetDistance: `${(((i * angle) + 90) / 360) * 100}%` }}
                        animate={controls[i][0]}
                        transition={transition}
                        style={{ offsetPath: 'circle(25% at 50% 50%)' }}
                    >
                        {t.members[0]}
                    </motion.div>
                    <motion.div
                        className="absolute border-2 border-red-500"
                        initial={{ offsetRotate: '360deg', offsetDistance: `${(((i * angle) + 270) / 360) * 100}%` }}
                        animate={controls[i][1]}
                        transition={transition}
                        style={{ offsetPath: 'circle(25% at 50% 50%)' }}
                    >
                        {t.members[1]}
                    </motion.div>
                </Fragment>
            )}

            {!playing &&
                <Button className="top-1/2 left-1/2 absolute -translate-x-[50%] -translate-y-[50%]" onClick={() => {
                    // To do: fetch words
                    setPlaying(true)
                }}>
                    Start
                </Button>
            }

            {playing &&
                <div className="top-1/2 left-1/2 absolute -translate-x-[50%] -translate-y-[50%]" onClick={() => {
                    stopTimer()

                    // Add score
                    teams[turns.current % teams.length].score += DateTime.utc().toUnixInteger() - startedAt.current
                    setTeams([...teams])

                    rotate()

                    startedAt.current = DateTime.utc().toUnixInteger()
                    startTimer(() => {
                        console.log('tick')
                        setPlaying(false)
                    })
                }}>
                    {words[turns.current % words.length]}
                </div>
            }

            <Button onClick={() => finish()}>End</Button>
        </div>
    )
}

export default Game
