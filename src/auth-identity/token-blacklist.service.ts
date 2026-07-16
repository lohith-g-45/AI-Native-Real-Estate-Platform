import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevokedToken } from './entities/revoked-token.entity';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(RevokedToken)
    private readonly revokedTokenRepository: Repository<RevokedToken>,
  ) {}

  async revokeToken(token: string) {
    if (!token) {
      return;
    }

    const exists = await this.revokedTokenRepository.findOne({ where: { token } });
    if (exists) {
      return;
    }

    const revokedToken = this.revokedTokenRepository.create({ token });
    await this.revokedTokenRepository.save(revokedToken);
  }

  async isTokenRevoked(token: string): Promise<boolean> {
    if (!token) {
      return false;
    }

    const record = await this.revokedTokenRepository.findOne({ where: { token } });
    return !!record;
  }
}
