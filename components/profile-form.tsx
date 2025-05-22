"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { createClient_Client } from "@/lib/supabase"
import { Loader2, User, Mail, MapPin, Briefcase, Building, Phone, Calendar, LinkIcon } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ProfileFormProps = {
  user: any // Usuário do Supabase Auth
  profile: any // Perfil do usuário da tabela profiles
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || "",
    avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || "",
    website: profile?.website || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    job_title: profile?.job_title || "",
    company: profile?.company || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth ? format(new Date(profile.date_of_birth), "yyyy-MM-dd") : "",
  })
  const router = useRouter()
  const supabase = createClient_Client()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      let avatarUrl = formData.avatar_url

      // Upload do avatar, se um novo for selecionado
      if (avatar) {
        const fileExt = avatar.name.split(".").pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        // Upload para o storage do Supabase
        const { error: uploadError, data } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar, { upsert: true })

        if (uploadError) {
          throw uploadError
        }

        // Obter URL pública
        const { data: urlData } = await supabase.storage.from("avatars").getPublicUrl(filePath)
        avatarUrl = urlData.publicUrl
      }

      // Atualizar perfil
      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      // Atualizar metadata do usuário no auth
      await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: avatarUrl,
        },
      })

      setMessage({
        type: "success",
        text: "Perfil atualizado com sucesso!",
      })

      // Atualizar a página para refletir as alterações
      router.refresh()
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      setMessage({
        type: "error",
        text: error.message || "Erro ao atualizar o perfil. Por favor, tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getAvatarFallback = () => {
    if (formData.full_name) {
      return formData.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return user.email.substring(0, 2).toUpperCase()
  }

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
        <TabsTrigger value="account">Conta</TabsTrigger>
      </TabsList>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <TabsContent value="personal">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Perfil Pessoal</CardTitle>
              <CardDescription>Atualize suas informações pessoais e profissionais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatar ? URL.createObjectURL(avatar) : formData.avatar_url} />
                    <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="block mb-2 text-sm">
                      Foto de perfil
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="w-full text-sm"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <User size={16} />
                        Nome completo
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail size={16} />
                        Email
                      </Label>
                      <Input id="email" value={user.email} disabled className="bg-[#252525] text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin size={16} />
                        Localização
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Cidade, País"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                        <Calendar size={16} />
                        Data de nascimento
                      </Label>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job_title" className="flex items-center gap-2">
                        <Briefcase size={16} />
                        Cargo
                      </Label>
                      <Input
                        id="job_title"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleChange}
                        placeholder="Seu cargo atual"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2">
                        <Building size={16} />
                        Empresa
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Sua empresa atual"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone size={16} />
                        Telefone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+XX (XX) XXXXX-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <LinkIcon size={16} />
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://seusite.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Conte um pouco sobre você..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Gerencie as configurações da sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Alterar senha</h3>
                <p className="text-sm text-gray-400">
                  Para alterar sua senha, clique no botão abaixo para receber um link por email.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  setLoading(true)
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                      redirectTo: `${window.location.origin}/reset-password?type=recovery`,
                    })

                    if (error) throw error

                    setMessage({
                      type: "success",
                      text: "Email enviado! Verifique sua caixa de entrada para redefinir sua senha.",
                    })
                  } catch (error: any) {
                    setMessage({
                      type: "error",
                      text: "Erro ao enviar email de redefinição de senha.",
                    })
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Solicitar redefinição de senha"
                )}
              </Button>
            </div>

            <div className="space-y-4 border-t border-gray-700 pt-6">
              <div>
                <h3 className="text-lg font-medium text-red-500">Zona de perigo</h3>
                <p className="text-sm text-gray-400">Cuidado, estas ações são irreversíveis.</p>
              </div>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (
                    window.confirm(
                      "Tem certeza que deseja sair de todas as sessões? Você precisará fazer login novamente.",
                    )
                  ) {
                    setLoading(true)
                    try {
                      const { error } = await supabase.auth.signOut({ scope: "global" })
                      if (error) throw error
                      router.push("/")
                    } catch (error) {
                      setMessage({
                        type: "error",
                        text: "Erro ao sair de todas as sessões.",
                      })
                      setLoading(false)
                    }
                  }
                }}
                disabled={loading}
              >
                Sair de todas as sessões
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
