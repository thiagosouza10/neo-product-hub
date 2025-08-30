import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '../data/users.json');

// Função para ler usuários do arquivo
export const readUsersFromFile = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      // Se o arquivo não existe, cria com usuários padrão
      const defaultUsers = [
        {
          id: "1",
          name: "Administrador",
          username: "admin",
          password: "admin123",
          role: "admin",
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        {
          id: "2",
          name: "João Silva",
          username: "joao",
          password: "senha123",
          role: "manager",
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        {
          id: "3",
          name: "Maria Santos",
          username: "maria",
          password: "senha456",
          role: "user",
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        }
      ];
      
      fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }
    
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de usuários:', error);
    return [];
  }
};

// Função para escrever usuários no arquivo
export const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo de usuários:', error);
    return false;
  }
};

// Função para obter todos os usuários
export const getAllUsers = () => {
  return readUsersFromFile();
};

// Função para obter usuário por ID
export const getUserById = (id) => {
  const users = readUsersFromFile();
  return users.find(user => user.id === id);
};

// Função para obter usuário por username
export const getUserByUsername = (username) => {
  const users = readUsersFromFile();
  return users.find(user => user.username === username);
};

// Função para autenticar usuário
export const authenticateUser = (username, password) => {
  const users = readUsersFromFile();
  const user = users.find(u => 
    u.username === username && 
    u.password === password && 
    u.active === true
  );
  
  if (user) {
    // Atualizar último login
    user.lastLogin = new Date().toISOString();
    writeUsersToFile(users);
    
    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

// Função para criar novo usuário
export const createUser = (userData) => {
  const users = readUsersFromFile();
  
  // Verificar se username já existe
  if (users.find(u => u.username === userData.username)) {
    throw new Error('Username já existe');
  }
  
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    lastLogin: null
  };
  
  users.push(newUser);
  
  if (writeUsersToFile(users)) {
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  
  throw new Error('Erro ao salvar usuário');
};

// Função para atualizar usuário
export const updateUser = (id, userData) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  // Verificar se username já existe (exceto para o usuário atual)
  const usernameExists = users.find(u => 
    u.username === userData.username && u.id !== id
  );
  
  if (usernameExists) {
    throw new Error('Username já existe');
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    id // Manter ID original
  };
  
  if (writeUsersToFile(users)) {
    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }
  
  throw new Error('Erro ao atualizar usuário');
};

// Função para deletar usuário
export const deleteUser = (id) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  // Não permitir deletar usuário admin
  if (users[userIndex].username === 'admin') {
    throw new Error('Não é possível deletar o usuário admin');
  }
  
  users.splice(userIndex, 1);
  
  if (writeUsersToFile(users)) {
    return true;
  }
  
  throw new Error('Erro ao deletar usuário');
};

// Função para alterar senha
export const changePassword = (username, newPassword) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(u => u.username === username);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  users[userIndex].password = newPassword;
  
  if (writeUsersToFile(users)) {
    return true;
  }
  
  throw new Error('Erro ao alterar senha');
};

// Função para ativar/desativar usuário
export const toggleUserStatus = (id) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    throw new Error('Usuário não encontrado');
  }
  
  // Não permitir desativar usuário admin
  if (users[userIndex].username === 'admin') {
    throw new Error('Não é possível desativar o usuário admin');
  }
  
  users[userIndex].active = !users[userIndex].active;
  
  if (writeUsersToFile(users)) {
    return users[userIndex];
  }
  
  throw new Error('Erro ao alterar status do usuário');
};
