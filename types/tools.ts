export interface Tool {
  id: string
  name: string
  icon?: string
  url?: string
  description?: string
}

export interface Category {
  id: string
  title: string
  description: string
  gradient: string
  tools: Tool[]
}
