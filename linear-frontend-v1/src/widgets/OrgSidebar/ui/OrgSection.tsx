import { useState } from 'react'
import type { Team } from '@/entities/team'
import { OrgHeader } from './OrgHeader'
import { TeamItem } from './TeamItem'

interface OrgSectionProps {
  orgId: string
  orgName: string
  teams: Team[]
  activeTeamId: string | null
  singleOrg?: boolean
  onTeamSelect: (teamId: string) => void
}

export function OrgSection({
  orgName,
  teams,
  activeTeamId,
  singleOrg,
  onTeamSelect,
}: OrgSectionProps) {
  const [isExpanded, setIsExpanded] = useState(!singleOrg)
  const isCollapsible = teams.length > 1 || !singleOrg

  return (
    <div className="px-2">
      {isCollapsible ? (
        <OrgHeader
          name={orgName}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
        />
      ) : (
        <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
          {orgName}
        </div>
      )}
      {isExpanded && (
        <div className="mt-0.5" role="group">
          {teams.map((team) => (
            <TeamItem
              key={team.id}
              name={team.name}
              teamKey={team.key}
              isActive={team.id === activeTeamId}
              onSelect={() => onTeamSelect(team.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
