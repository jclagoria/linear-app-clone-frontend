export interface Project {
  id: string
  name: string
  description: string
  icon: string
  status: string
  teamId: string
  createdAt: string
  updatedAt: string
}

export interface Cycle {
  id: string
  name: string
  teamId: string
  startsAt: string
  endsAt: string
  status: 'upcoming' | 'active' | 'completed'
  createdAt: string
  updatedAt: string
}
