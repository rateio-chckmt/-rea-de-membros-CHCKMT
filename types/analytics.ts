export interface ToolUsageData {
  toolId: string
  toolName: string
  count: number
  percentage: number
  categoryName?: string
  categoryColor?: string
}

export interface UserActivityData {
  date: string
  activeUsers: number
  newUsers: number
}

export interface CategoryDistributionData {
  categoryId: string
  categoryName: string
  toolCount: number
  percentage: number
  color: string
}

export interface TopUserData {
  userId: string
  userName: string
  accessCount: number
  lastAccess: string
  avatarUrl?: string
}

export interface AnalyticsSummary {
  totalUsers: number
  totalTools: number
  totalAccesses: number
  activeUsersToday: number
  newUsersThisWeek: number
  popularTool: {
    id: string
    name: string
    accessCount: number
  }
}
