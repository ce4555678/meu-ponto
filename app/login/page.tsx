"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Clock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const supabaseConfigured = isSupabaseConfigured()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.")
      return
    }

    if (!supabaseConfigured) {
      setErro("Supabase não configurado. Configure as variáveis de ambiente.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      
      if (!supabase) {
        setErro("Erro ao conectar com o Supabase.")
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErro("Email ou senha incorretos.")
        } else if (error.message.includes("Email not confirmed")) {
          setErro("Por favor, confirme seu email antes de fazer login.")
        } else {
          setErro(error.message)
        }
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setErro("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e título */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Clock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Meu Ponto
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de controle de ponto eletrônico
          </p>
        </div>

        {/* Card de login */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
            <CardDescription>
              Digite seu email e senha para acessar o sistema
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Aviso Supabase não configurado */}
              {!supabaseConfigured && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Supabase não configurado. Configure as variáveis de ambiente para habilitar a autenticação.
                  </span>
                </div>
              )}

              {/* Mensagem de erro */}
              {erro && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {erro}
                </div>
              )}

              {/* Campo de email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                  className="h-10"
                />
              </div>

              {/* Campo de senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                  <Link
                    href="/esqueci-senha"
                    className="text-xs text-muted-foreground hover:text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent pt-2">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Ainda não tem uma conta?{" "}
                <Link
                  href="/cadastro"
                  className="font-medium text-primary hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Rodapé */}
        <p className="text-center text-xs text-muted-foreground">
          Ao entrar, você concorda com nossos{" "}
          <Link href="/termos" className="hover:text-primary hover:underline">
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link
            href="/privacidade"
            className="hover:text-primary hover:underline"
          >
            Política de Privacidade
          </Link>
        </p>
      </div>
    </div>
  )
}
