import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Edit, 
  Trash2, 
  Users, 
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getUsers, 
  createUser, 
  updateUser,
  deleteUser, 
  changePassword, 
  User 
} from '@/services/UserService';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user' | 'manager',
    active: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await getUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.username || !formData.password) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
      });
      return;
    }

    try {
      if (editingUser) {
        // Atualizar usuário existente
        try {
          const updatedUser = await updateUser(editingUser.id, formData);
          const updatedUsers = users.map(u => 
            u.id === editingUser.id ? updatedUser : u
          );
          setUsers(updatedUsers);
          
          toast({
            title: "Usuário atualizado!",
            description: "Usuário foi atualizado com sucesso.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Erro ao atualizar usuário.",
          });
          return;
        }
      } else {
        // Adicionar novo usuário
        try {
          const newUser = await createUser(formData);
          setUsers([...users, newUser]);
          
          toast({
            title: "Usuário criado!",
            description: "Novo usuário foi adicionado ao sistema.",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Erro ao criar usuário.",
          });
          return;
        }
      }

      // Limpar formulário
      setFormData({
        name: '',
        username: '',
        password: '',
        role: 'user',
        active: true
      });
      setIsAddingUser(false);
      setEditingUser(null);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar usuário.",
      });
    }
  };

  const handleEdit = (user: UserConfig) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role,
      active: user.active
    });
    setIsAddingUser(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja remover este usuário?')) {
      try {
        await deleteUser(userId);
        await loadUsers();
        
        toast({
          title: "Usuário removido!",
          description: "Usuário foi removido do sistema.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao remover usuário.",
        });
      }
    }
  };

  const handleChangePassword = async (username: string) => {
    const newPassword = prompt(`Digite a nova senha para ${username}:`);
    if (newPassword && newPassword.length >= 3) {
      try {
        await changePassword(username, newPassword);
        await loadUsers();
        
        toast({
          title: "Senha alterada!",
          description: "Senha foi alterada com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao alterar senha.",
        });
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'manager':
        return <Badge variant="default">Manager</Badge>;
      case 'user':
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestão de Usuários</h2>
          <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
        </div>
        <Button 
          onClick={() => {
            setIsAddingUser(true);
            setEditingUser(null);
            setFormData({
              name: '',
              username: '',
              password: '',
              role: 'user',
              active: true
            });
          }}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Formulário de usuário */}
      {isAddingUser && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Usuário</label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Nome de usuário"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Senha"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Perfil</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="user">Usuário</option>
                  <option value="manager">Gerente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Usuário ativo</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingUser ? 'Atualizar' : 'Criar'} Usuário
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setIsAddingUser(false);
                  setEditingUser(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de usuários */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Usuários do Sistema</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPasswords ? 'Ocultar' : 'Mostrar'} Senhas
          </Button>
        </div>
        
        <div className="space-y-3">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    @{user.username}
                  </div>
                </div>
                {getRoleBadge(user.role)}
                <Badge variant={user.active ? "default" : "secondary"}>
                  {user.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {showPasswords && (
                  <div className="text-sm text-muted-foreground">
                    Senha: {user.password}
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleChangePassword(user.username)}
                >
                  <Shield className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(user)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
                  disabled={user.username === 'admin'}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
