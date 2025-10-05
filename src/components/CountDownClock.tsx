import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from 'framer-motion'

function CountDownClock({ durationSeconds, resetRef }: { durationSeconds: number, resetRef?: number }) {
    const startedAt = useRef(0)
    const timer = useRef<number | undefined>(undefined)

    const [timeLeft, setTimeLeft] = useState(durationSeconds)

    const controls = useAnimation()

    useEffect(() => {
        controls.stop()
        controls.set({ width: '0%' })
        controls.start({ width: '100%', opacity: 1 })

        startedAt.current = DateTime.utc().toUnixInteger()

        timer.current = setInterval(() => {
            const difference = DateTime.utc().toUnixInteger() - startedAt.current

            if (timer.current && difference >= durationSeconds) {
                clearInterval(timer.current)
                timer.current = undefined
            }

            setTimeLeft(durationSeconds - difference)
        }, 1000)

        return () => {
            clearInterval(timer.current)
            timer.current = undefined
        }
    }, [resetRef])

    let h = (Math.floor(timeLeft / 3600)).toString()
    let m = (Math.floor((timeLeft % 3600) / 60)).toString()
    let s = (Math.floor(timeLeft % 60)).toString()

    // console.log('CountDownClock', { startedAt: startedAt.current, timer: timer.current, timeLeft, h, m, s })

    return (
        <div>
            <motion.div
                className="rounded-sm w-4 h-4 bg-primary"
                initial={{ width: '0%', opacity: 0 }}
                animate={controls}
                exit={{ opacity: 0 }}
                transition={{
                    width: {
                        duration: durationSeconds
                    },
                    opacity: {
                        duration: 0.5
                    }
                }}
            />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: h ? 1 : 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                {`${h.length < 2 ? '0' : ''}${h}:${m.length < 2 ? '0' : ''}${m}:${s.length < 2 ? '0' : ''}${s}`}
            </motion.div >
        </div>
    )
}

export default CountDownClock
