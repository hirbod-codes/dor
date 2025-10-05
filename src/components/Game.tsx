import { Fragment, useEffect, useRef, useState } from "react"
import { motion, progress, useAnimation, type Transition } from 'framer-motion'
import type { Team } from "./types"
import { useSpring, animated } from '@react-spring/web'
import { Button } from "./shadcn/ui/button"

const transition: Transition = {
    duration: 1,
    ease: "easeInOut",
}

function Game({ teams }: { teams: Team[] }) {
    let controls: any[] = []
    const turns = useRef(0)

    let angle = 360 / (teams.length * 2) // Since each team has two members
    teams.map((_, i) => {
        let diffRadians = (270 + (angle * i)) / 180

        console.log(i, `angle is: ${angle}, angle in radians: ${diffRadians} or ${(180 * diffRadians)}, cos: ${Math.cos(diffRadians)}, sin: ${Math.sin(diffRadians)}`)

        controls[i] = [useAnimation(), useAnimation()]
    })

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
        </div>
    )
}

export default Game
