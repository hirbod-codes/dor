import { Button } from "./shadcn/ui/button"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./shadcn/ui/field"
import { Input } from "./shadcn/ui/input"
import Trash from '@/assets/Trash.svg?react'
import type { Team } from "./types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./shadcn/ui/select"

export type GamePropertiesProps = {
    teams: Team[]
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>
    maxTurns: number
    setMaxTurns: React.Dispatch<React.SetStateAction<number>>
    eachTurnDurationSeconds: number
    setEachTurnDurationSeconds: React.Dispatch<React.SetStateAction<number>>
    wordsCategory: string
    setWordsCategory: React.Dispatch<React.SetStateAction<string>>
}

function GameProperties({ teams, setTeams, maxTurns, setMaxTurns, eachTurnDurationSeconds, setEachTurnDurationSeconds, wordsCategory, setWordsCategory }: GamePropertiesProps) {
    return (
        <>
            <div className="p-2 overflow-y-auto">
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>
                            Add your teams
                        </FieldLegend>

                        <Button className="bg-accent text-accent-foreground" onClick={() => setTeams([...teams, { members: [], score: 0 }])}>Add Team</Button>

                        <div className="max-h-90 overflow-y-auto border-2 py-2">
                            {teams.map((_t, i) =>
                                <div key={i} className="flex flex-row *:m-1 items-center">
                                    <Input required max={15} value={teams[i].members[0] ?? ''} onChange={(e) => {
                                        teams[i].members[0] = e.target.value
                                        setTeams([...teams])
                                    }} />
                                    <Input required max={15} value={teams[i].members[1] ?? ''} onChange={(e) => {
                                        teams[i].members[1] = e.target.value
                                        setTeams([...teams])
                                    }} />
                                    {i >= 2 && <Trash className="w-24 fill-destructive stroke-destructive" fontSize={20} onClick={() => setTeams((p) => p.filter((_, fi) => fi !== i))} />}
                                </div>
                            )}
                        </div>

                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="eachTurnDurationSeconds">
                                    Each turn's duration
                                </FieldLabel>
                                <Input
                                    required
                                    id="eachTurnDurationSeconds"
                                    value={eachTurnDurationSeconds}
                                    onChange={(e) => {
                                        let n = Number(e.target.value)
                                        if (!Number.isNaN(n) && n <= 7200 && n > 0)
                                            setEachTurnDurationSeconds(n)
                                    }}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="maxTurns">
                                    Maximum number of turns
                                </FieldLabel>
                                <Input
                                    required
                                    id="maxTurns"
                                    value={maxTurns}
                                    onChange={(e) => {
                                        let n = Number(e.target.value)
                                        if (!Number.isNaN(n) && n <= 30 && n > 0)
                                            setMaxTurns(n)
                                    }}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="wordsCategory">
                                    Choose words category
                                </FieldLabel>
                                <Select defaultValue={wordsCategory ?? 'animals'} value={wordsCategory} onValueChange={(v) => setWordsCategory(v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Category' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="animals">animals</SelectItem>
                                        <SelectItem value="jobs">jobs</SelectItem>
                                        <SelectItem value="things">things</SelectItem>
                                        <SelectItem value="things">places</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>

                    </FieldSet>
                </FieldGroup>
            </div>
        </>
    )
}

export default GameProperties
