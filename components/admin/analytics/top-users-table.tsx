"use client"

import { useState, useEffect } from "react"
import { getTopUsers } from "@/lib/analytics-utils"
import type { TopUserData } from "@/types/analytics"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface TopUsersTableProps {
  limit?: number
}

export default function TopUsersTable({ limit = 5 }: TopUsersTableProps) {
  const [data, setData] = useState<TopUserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topUsersData = await getTopUsers(limit)
        setData(topUsersData)
      } catch (error) {
        console.error("Erro ao buscar dados dos usuários mais ativos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-gray-500">Nenhum dado de usuário disponível</p>
      </div>
    )
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "Data inválida"
    }
  }

  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead className="text-right">Acessos</TableHead>
          <TableHead className="hidden md:table-cell">Último Acesso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.userId}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatarUrl || ""} alt={user.userName} />
                  <AvatarFallback>{getInitials(user.userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.userName}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">{user.accessCount}</TableCell>
            <TableCell className="hidden md:table-cell">{formatDate(user.lastAccess)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
