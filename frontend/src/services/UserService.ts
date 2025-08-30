// Serviço para gerenciar usuários via API
const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'user' | 'manager';
  active: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface UserCreate {
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
  active?: boolean;
}

export interface UserUpdate {
  name?: string;
  username?: string;
  password?: string;
  role?: 'admin' | 'user' | 'manager';
  active?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Função para fazer login
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro no login');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Função para obter todos os usuários
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error('Erro ao obter usuários');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    throw error;
  }
};

// Função para obter usuário por ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    
    if (!response.ok) {
      throw new Error('Usuário não encontrado');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    throw error;
  }
};

// Função para criar novo usuário
export const createUser = async (userData: UserCreate): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar usuário');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Função para atualizar usuário
export const updateUser = async (id: string, userData: UserUpdate): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar usuário');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// Função para deletar usuário
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao deletar usuário');
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

// Função para alterar senha
export const changePassword = async (username: string, newPassword: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao alterar senha');
    }

    return true;
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    throw error;
  }
};

// Função para ativar/desativar usuário
export const toggleUserStatus = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
      method: 'PUT',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao alterar status do usuário');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error);
    throw error;
  }
};
