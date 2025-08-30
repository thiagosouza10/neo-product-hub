// Configuração de usuários do sistema
export interface UserConfig {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
  active: boolean;
}

// Lista de usuários padrão
export const defaultUsers: UserConfig[] = [
  {
    id: '1',
    name: 'Administrador',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    active: true
  },
  {
    id: '2',
    name: 'João Silva',
    username: 'joao',
    password: 'senha123',
    role: 'manager',
    active: true
  },
  {
    id: '3',
    name: 'Maria Santos',
    username: 'maria',
    password: 'senha456',
    role: 'user',
    active: true
  }
];

// Função para obter usuários
export const getUsers = (): UserConfig[] => {
  try {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      return JSON.parse(usersData);
    }
    // Se não existem usuários, cria os padrões
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return defaultUsers;
  }
};

// Função para salvar usuários
export const saveUsers = (users: UserConfig[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
};

// Função para adicionar novo usuário
export const addUser = (user: Omit<UserConfig, 'id'>): UserConfig => {
  const users = getUsers();
  const newUser: UserConfig = {
    ...user,
    id: Date.now().toString()
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Função para remover usuário
export const removeUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== id);
  
  if (filteredUsers.length < users.length) {
    saveUsers(filteredUsers);
    return true;
  }
  return false;
};

// Função para alterar senha
export const changePassword = (username: string, newPassword: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username === username);
  
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    saveUsers(users);
    return true;
  }
  return false;
};
