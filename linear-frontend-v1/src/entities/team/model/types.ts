export interface Team {
  id: string
  name: string
  key: string
  orgId: string
  orgName: string
}

export interface OrgGroup {
  orgId: string
  orgName: string
  teams: Team[]
}

export function groupTeamsByOrg(teams: Team[]): OrgGroup[] {
  const map = new Map<string, OrgGroup>()
  for (const team of teams) {
    let group = map.get(team.orgId)
    if (!group) {
      group = { orgId: team.orgId, orgName: team.orgName, teams: [] }
      map.set(team.orgId, group)
    }
    group.teams.push(team)
  }
  return Array.from(map.values())
}
