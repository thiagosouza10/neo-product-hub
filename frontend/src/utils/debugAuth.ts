// Utilitário para debug do sistema de autenticação
import { getUsers, defaultUsers } from '@/config/users';

export const debugAuth = () => {
  console.log('🔍 === DEBUG DO SISTEMA DE AUTENTICAÇÃO ===');
  
  // Verificar localStorage
  console.log('📦 LocalStorage atual:');
  console.log('- users:', localStorage.getItem('users'));
  console.log('- currentUser:', localStorage.getItem('currentUser'));
  
  // Verificar usuários padrão
  console.log('👥 Usuários padrão configurados:');
  console.log(defaultUsers);
  
  // Verificar função getUsers
  console.log('🔧 Resultado da função getUsers():');
  const users = getUsers();
  console.log(users);
  
  // Testar login específico
  console.log('🧪 Testando login admin/admin123:');
  const adminUser = users.find(u => 
    u.username === 'admin' && 
    u.password === 'admin123' && 
    u.active === true
  );
  
  if (adminUser) {
    console.log('✅ Usuário admin encontrado:', adminUser);
  } else {
    console.log('❌ Usuário admin NÃO encontrado!');
    console.log('🔍 Usuários disponíveis:', users);
  }
  
  // Verificar se há problemas de case sensitivity
  console.log('🔍 Verificando case sensitivity:');
  const adminLower = users.find(u => 
    u.username.toLowerCase() === 'admin' && 
    u.password === 'admin123'
  );
  const adminUpper = users.find(u => 
    u.username.toUpperCase() === 'ADMIN' && 
    u.password === 'admin123'
  );
  
  console.log('- admin (lowercase):', adminLower);
  console.log('- ADMIN (uppercase):', adminUpper);
  
  return {
    users,
    adminUser,
    localStorageUsers: localStorage.getItem('users'),
    localStorageCurrentUser: localStorage.getItem('currentUser')
  };
};

export const resetAuth = () => {
  console.log('🔄 Resetando sistema de autenticação...');
  
  // Limpar localStorage
  localStorage.removeItem('users');
  localStorage.removeItem('currentUser');
  
  console.log('✅ LocalStorage limpo');
  
  // Recarregar usuários padrão
  const users = getUsers();
  console.log('✅ Usuários padrão recarregados:', users);
  
  return users;
};

export const testLogin = (username: string, password: string) => {
  console.log(`🧪 Testando login: ${username}/${password}`);
  
  const users = getUsers();
  const user = users.find(u => 
    u.username === username && 
    u.password === password && 
    u.active === true
  );
  
  if (user) {
    console.log('✅ Login bem-sucedido:', user);
    return true;
  } else {
    console.log('❌ Login falhou');
    console.log('🔍 Usuários disponíveis:', users);
    return false;
  }
};
