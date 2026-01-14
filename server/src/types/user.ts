export type UserRole = 'user' | 'chef' | 'admin';
export type UserStatus = 'active' | 'fraud';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  chefId?: string | undefined;
  photoURL?: string;
  address?: string;
};

