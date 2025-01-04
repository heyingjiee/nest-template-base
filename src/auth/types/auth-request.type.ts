import { Profile } from 'passport-github2';

// AuthGuard('xxx')验证成功后返回的类型
export interface UserPassport {
  userId: number;
  username: string;
}

// AuthGuard('github')验证用户不存在，返回的类型
export interface GithubUserPassport {
  profile: Profile;
}

// 已授权的 Request 请求类型
export interface AuthedRequest<T = UserPassport> extends Request {
  user: T;
}
