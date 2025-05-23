import type React from "react"
import Link from "next/link"

interface CategoryCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, description, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link href={`/tools/${id}`} className="text-blue-500 hover:underline">
          View Tools
        </Link>
      </div>
    </div>
  )
}

export default CategoryCard
