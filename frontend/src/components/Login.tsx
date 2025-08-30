import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, User, Lock, Bug } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { debugAuth, resetAuth, testLogin } from '@/utils/debugAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔍 Tentando login com:', { username, password });
      
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema de produtos.",
        });
        navigate('/dashboard');
      } else {
        console.log('❌ Login falhou - usuário não encontrado');
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Usuário não encontrado ou credenciais inválidas.",
        });
      }
    } catch (error) {
      console.error('💥 Erro durante login:', error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dark">
      <div className="animate-fade-in">
        <Card className="glass-card w-full max-w-md p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Login</h1>
            <p className="text-muted-foreground">Acesse o sistema de produtos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-input border-border focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-input border-border focus:ring-primary"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>Use credenciais cadastradas no sistema</span>
            </div>
            
            {/* Botões de Debug */}
            <div className="flex gap-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('🔍 === DEBUG INICIADO ===');
                  debugAuth();
                  toast({
                    title: "Debug iniciado",
                    description: "Verifique o console do navegador (F12)",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Bug className="w-3 h-3" />
                Debug
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  resetAuth();
                  toast({
                    title: "Sistema resetado",
                    description: "Tente fazer login novamente",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Bug className="w-3 h-3" />
                Reset
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  testLogin('admin', 'admin123');
                  toast({
                    title: "Teste realizado",
                    description: "Verifique o console para resultados",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Bug className="w-3 h-3" />
                Teste
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;