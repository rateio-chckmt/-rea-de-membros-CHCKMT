"use client"

import { useState } from "react"
import CategoryCard from "./category-card"
import { categoriesData } from "@/data/categories"

interface ToolsGridProps {
  searchQuery: string
}

export default function ToolsGrid({ searchQuery }: ToolsGridProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const filteredCategories = searchQuery
    ? categoriesData.filter(
        (category) =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.tools.some((tool) => tool.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : categoriesData

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCategories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isExpanded={expandedCategory === category.id}
          onToggle={() => toggleCategory(category.id)}
          highlight={searchQuery}
        />
      ))}
    </div>
  )
}
