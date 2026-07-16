import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklist = new Set<string>();

  revokeToken(token: string) {
    if (token) {
      this.blacklist.add(token);
    }
  }

  isTokenRevoked(token: string): boolean {
    return this.blacklist.has(token);
  }
}
