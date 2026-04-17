import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFilePath = path.join(__dirname, '../data/users.json');

const sanitizeUserForResponse = user => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const isProtectedAdminUser = user => user?.username === 'admin';

export const readUsersFromFile = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      const defaultUsers = [
        {
          id: '1',
          name: 'Administrador',
          username: 'admin',
          password: 'admin',
          role: 'admin',
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
        {
          id: '2',
          name: 'Joao Silva',
          username: 'joao',
          password: 'senha123',
          role: 'manager',
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
        {
          id: '3',
          name: 'Maria Santos',
          username: 'maria',
          password: 'senha456',
          role: 'user',
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null,
        },
      ];

      fs.writeFileSync(usersFilePath, JSON.stringify(defaultUsers, null, 2));
      return defaultUsers;
    }

    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de usuarios:', error);
    return [];
  }
};

export const writeUsersToFile = users => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao escrever arquivo de usuarios:', error);
    return false;
  }
};

export const getAllUsers = () => readUsersFromFile();

export const getUserById = id => {
  const users = readUsersFromFile();
  return users.find(user => user.id === id);
};

export const getUserByUsername = username => {
  const users = readUsersFromFile();
  return users.find(user => user.username === username);
};

export const authenticateUser = (username, password) => {
  const users = readUsersFromFile();
  const user = users.find(
    item =>
      item.username === username &&
      item.password === password &&
      item.active === true
  );

  if (!user) {
    return null;
  }

  user.lastLogin = new Date().toISOString();
  writeUsersToFile(users);

  return sanitizeUserForResponse(user);
};

export const createUser = userData => {
  const users = readUsersFromFile();

  if (users.find(user => user.username === userData.username)) {
    throw new Error('USERNAME_ALREADY_EXISTS');
  }

  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  users.push(newUser);

  if (writeUsersToFile(users)) {
    return sanitizeUserForResponse(newUser);
  }

  throw new Error('USER_SAVE_FAILED');
};

export const updateUser = (id, userData) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    throw new Error('USER_NOT_FOUND');
  }

  const usernameExists = users.find(
    user => user.username === userData.username && user.id !== id
  );

  if (usernameExists) {
    throw new Error('USERNAME_ALREADY_EXISTS');
  }

  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    id,
  };

  if (writeUsersToFile(users)) {
    return sanitizeUserForResponse(users[userIndex]);
  }

  throw new Error('USER_UPDATE_FAILED');
};

export const deleteUser = id => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    throw new Error('USER_NOT_FOUND');
  }

  if (isProtectedAdminUser(users[userIndex])) {
    throw new Error('PROTECTED_ADMIN_DELETE');
  }

  users.splice(userIndex, 1);

  if (writeUsersToFile(users)) {
    return true;
  }

  throw new Error('USER_DELETE_FAILED');
};

export const changePassword = (username, newPassword) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(user => user.username === username);

  if (userIndex === -1) {
    throw new Error('USER_NOT_FOUND');
  }

  users[userIndex].password = newPassword;

  if (writeUsersToFile(users)) {
    return true;
  }

  throw new Error('PASSWORD_CHANGE_FAILED');
};

export const toggleUserStatus = id => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    throw new Error('USER_NOT_FOUND');
  }

  if (isProtectedAdminUser(users[userIndex])) {
    throw new Error('PROTECTED_ADMIN_TOGGLE');
  }

  users[userIndex].active = !users[userIndex].active;

  if (writeUsersToFile(users)) {
    return sanitizeUserForResponse(users[userIndex]);
  }

  throw new Error('USER_STATUS_UPDATE_FAILED');
};
