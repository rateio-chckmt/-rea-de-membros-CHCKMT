"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient_Client } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

type SettingsFormProps = {
  user: any
  preferences?: any
}

export default function SettingsForm({ user, preferences = {} }: SettingsFormProps) {
  const defaultPreferences = {
    emailNotifications: preferences?.emailNotifications ?? true,
    marketingEmails: preferences?.marketingEmails ?? false,
    darkMode: preferences?.darkMode ?? true,
    ...preferences,
  }

  const [settings, setSettings] = useState(defaultPreferences)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient_Client()

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          preferences: settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      setMessage({
        type: "success",
        text: "Configurações atualizadas com sucesso!",
      })

      // Atualizar a página para refletir as alterações
      router.refresh()
    } catch (error: any) {
      console.error("Erro ao atualizar configurações:", error)
      setMessage({
        type: "error",
        text: error.message || "Erro ao atualizar as configurações. Por favor, tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "success"} className="mb-6">
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notificações</h3>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Notificações por email</Label>
            <p className="text-sm text-gray-400">Receba emails sobre atividades importantes.</p>
          </div>
          <Switch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={() => handleToggle("emailNotifications")}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="marketingEmails">Emails de marketing</Label>
            <p className="text-sm text-gray-400">Receba emails sobre novidades e promoções.</p>
          </div>
          <Switch
            id="marketingEmails"
            checked={settings.marketingEmails}
            onCheckedChange={() => handleToggle("marketingEmails")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Aparência</h3>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label htmlFor="darkMode">Modo escuro</Label>
            <p className="text-sm text-gray-400">Ative ou desative o tema escuro.</p>
          </div>
          <Switch id="darkMode" checked={settings.darkMode} onCheckedChange={() => handleToggle("darkMode")} />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => setSettings(defaultPreferences)}>
          Restaurar padrões
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar configurações"
          )}
        </Button>
      </div>
    </div>
  )
}
