import { motion, useAnimation, type Transition } from 'framer-motion'
import type { Team } from './types'
import { useEffect } from 'react'

const transition: Transition = {
    duration: 1,
    ease: [0, 1, 0.5, 1],
}

function Teammate({ team, angle, index, registerControls, unregisterControls }: { team: Team, angle: number, index: number, registerControls: (i: number, controls: any[]) => void, unregisterControls: (i: number) => void }) {
    const control1 = useAnimation()
    const control2 = useAnimation()

    useEffect(() => {
        registerControls(index, [control1, control2])

        return () => {
            unregisterControls(index)
        }
    }, [index, registerControls, unregisterControls, control1, control2])

    console.log('Teammate', { team, angle, index, a: `${(((index * angle) + 90) / 360) * 100}%` })

    return (
        <>
            <motion.div
                className="absolute"
                initial={{ offsetRotate: '360deg', offsetDistance: `${(((index * angle) + 90) / 360) * 100}%` }}
                animate={control1}
                transition={transition}
                style={{ offsetPath: 'circle(25% at 50% 50%)', willChange: 'transform offset-distance' }}
            >
                {team.members[0]}
            </motion.div>
            <motion.div
                className="absolute"
                initial={{ offsetRotate: '360deg', offsetDistance: `${(((index * angle) + 270) / 360) * 100}%` }}
                animate={control2}
                transition={transition}
                style={{ offsetPath: 'circle(25% at 50% 50%)', willChange: 'transform offset-distance' }}
            >
                {team.members[1]}
            </motion.div>
        </>
    )
}

export default Teammate
