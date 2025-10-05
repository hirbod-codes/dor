import { useEffect, useRef, useState } from 'react'
import './App.css'
import { useSpring, animated } from '@react-spring/web'
import { Button } from './components/shadcn/ui/button'
import GameProperties from './components/GameProperties'
import Sun from '@/assets/sun_sunny_heat_summer.svg?react'
import Moon from '@/assets/cloudy_night.svg?react'
import LeftArrow from '@/assets/left_arrow.svg?react'
import lightTheme from '@/themes/light.json'
import darkTheme from '@/themes/dark.json'
import type { Team } from './components/types'
import Game from './components/Game'
import { AppContext } from './context'

function App() {
    const [teams, setTeams] = useState<Team[]>([{ members: [], score: 0 }, { members: [], score: 0 }, { members: [], score: 0 }, { members: [], score: 0 }])
    const [stage, setStage] = useState<number>(0)

    const [maxTurns, setMaxTurns] = useState(0)
    const [eachTurnDurationSeconds, setEachTurnDurationSeconds] = useState(0)

    console.log('App', `teams: ${JSON.stringify(teams)}`, `stage: ${stage}`)

    const [styles0, api0] = useSpring(() => ({
        from: { left: '-100%' },
        config: {
            tension: 170,
            friction: 26
        }
    }))

    const [styles1, api1] = useSpring(() => ({
        from: { left: '-100%' },
        config: {
            tension: 170,
            friction: 26
        }
    }))

    useEffect(() => {
        switch (stage) {
            case 0:
                api1.start({ to: { left: '-100%' } })
                api0.start({ to: { left: '0%' } })
                break;

            case 1:
                api0.start({ to: { left: '-100%' } })
                api1.start({ to: { left: '0%' } })
                break;

            case 2:
                api0.start({ to: { left: '-100%' } })
                api1.start({ to: { left: '-100%' } })
                break;

            default:
                api0.start({ to: { left: '-100%' } })
                api1.start({ to: { left: '-100%' } })
                break;
        }
    }, [stage])

    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    const fetchFromLocalStorage = useRef(false)
    useEffect(() => {
        console.log(localStorage.getItem('teams'))
        if (localStorage.getItem('teams') !== null && localStorage.getItem('teams') !== undefined && localStorage.getItem('teams') !== 'undefined' && localStorage.getItem('teams') !== 'null')
            setTeams(JSON.parse(localStorage.getItem('teams') as string) as any)

        if (localStorage.getItem('maxTurns') !== null && localStorage.getItem('maxTurns') !== undefined && localStorage.getItem('maxTurns') !== 'undefined' && localStorage.getItem('maxTurns') !== 'null')
            setMaxTurns(Number.parseInt(localStorage.getItem('maxTurns')!))

        if (localStorage.getItem('eachTurnDurationSeconds') !== null && localStorage.getItem('eachTurnDurationSeconds') !== undefined && localStorage.getItem('eachTurnDurationSeconds') !== 'undefined' && localStorage.getItem('eachTurnDurationSeconds') !== 'null')
            setEachTurnDurationSeconds(Number.parseInt(localStorage.getItem('eachTurnDurationSeconds')!))

        if (localStorage.getItem('theme') !== null)
            changeTheme(localStorage.getItem('theme') as any)
        else if (window.matchMedia("(prefers-color-scheme:dark").matches)
            changeTheme('dark')
        else
            changeTheme('light')

        fetchFromLocalStorage.current = true
    }, [])

    const changeTheme = (t: 'dark' | 'light') => {
        const themeColors: { [k: string]: string } = t === 'light' ? lightTheme : darkTheme

        for (const key in themeColors)
            if (Object.prototype.hasOwnProperty.call(themeColors, key)) {
                const color = themeColors[key];

                document.documentElement.style.setProperty(`--${key}`, `hsl(${color})`)
            }

        localStorage.setItem('theme', t)
        setTheme(t)
    }

    const validateInput = (teams: Team[]) => {
        for (const team of teams)
            if (!team.members[0] || team.members[0].trim().length < 1 || !team.members[1] || team.members[1].trim().length < 1)
                return false

        return true
    }

    return (
        <AppContext.Provider value={{ eachTurnDurationSeconds, maxTurns }}>
            <div className="flex flex-col h-screen w-screen">
                <div className="w-full flex flex-row justify-start bg-primary items-center p-2">
                    {stage !== 0 && <LeftArrow className='cursor-pointer stroke-primary-foreground' fontSize={40} onClick={() => setStage(0)} />}
                    <div className="flex-1"></div>
                    {theme === 'dark' && <Sun className='cursor-pointer stroke-primary-foreground fill-primary-foreground' fontSize={30} onClick={() => changeTheme('light')} />}
                    {theme === 'light' && <Moon className='cursor-pointer stroke-primary-foreground fill-primary-foreground' fontSize={30} onClick={() => changeTheme('dark')} />}
                </div>

                <div className="h-[85%] w-full relative">
                    <animated.div className="top-0 left-0 absolute h-full w-full" style={{ ...styles0 }}>
                        <GameProperties
                            teams={teams}
                            setTeams={(v) => {
                                if (v !== undefined)
                                    localStorage.setItem('teams', JSON.stringify(v))
                                setTeams(v)
                            }}
                            maxTurns={maxTurns}
                            setMaxTurns={(v) => {
                                if (v !== undefined)
                                    localStorage.setItem('maxTurns', v.toString())
                                setMaxTurns(v)
                            }}
                            eachTurnDurationSeconds={eachTurnDurationSeconds}
                            setEachTurnDurationSeconds={(v) => {
                                if (v !== undefined)
                                    localStorage.setItem('eachTurnDurationSeconds', v.toString())
                                setEachTurnDurationSeconds(v)
                            }}
                        />
                    </animated.div >

                    <animated.div className="top-0 left-0 absolute h-full w-full" style={{ ...styles1 }}>
                        <Game teams={teams} setTeams={setTeams} finish={() => setStage(0)} />
                    </animated.div>
                </div>

                {stage === 0 &&
                    <div className="flex flex-col gap-2 items-center justify-center flex-1 w-full border-1 p-3">
                        <Button className='w-full' disabled={!validateInput(teams)} onClick={() => {
                            setStage(stage + 1)
                        }}>Start</Button>

                        {!validateInput(teams) && <div className='text-destructive'>Please fill all the fields</div>}
                    </div>
                }
            </div>
        </AppContext.Provider>
    )
}

export default App
