import { Button } from "./shadcn/ui/button"
import { FieldGroup, FieldLegend, FieldSet } from "./shadcn/ui/field"
import { Input } from "./shadcn/ui/input"
import Trash from '@/assets/Trash.svg?react'
import type { Team } from "./types"

function GameProperties({ teams, setTeams }: { teams: Team[], setTeams: React.Dispatch<React.SetStateAction<Team[]>> }) {
    return (
        <>
            <div className="p-2">
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>
                            Add your teams
                        </FieldLegend>

                        <Button className="bg-accent text-accent-foreground" onClick={() => setTeams([...teams, { members: [], score: 0 }])}>Add Team</Button>

                        <div className="max-h-90 overflow-y-auto border-2 border-red-500">
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
                                    <Trash className="w-24 fill-destructive stroke-destructive" fontSize={20} onClick={() => setTeams((p) => p.filter((_, fi) => fi !== i))} />
                                </div>
                            )}
                        </div>

                    </FieldSet>
                </FieldGroup>
            </div>
        </>
    )
}

export default GameProperties
