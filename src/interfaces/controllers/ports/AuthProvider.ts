import { UserId } from '../../../domain/user/UserId';

export interface AuthProvider {
  authorizeUser(userId: UserId, pass: string): Promise<any>;
}
