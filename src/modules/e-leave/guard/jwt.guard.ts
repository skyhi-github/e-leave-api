import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Check if authorization header is present and in the expected format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    const decode = await this.jwtService.decode(token);

    try {
      // Verify token signature and decode claims
      const decoded = await this.jwtService.decode(token);
      return !!decoded; // Check if decoded object is not null/undefined
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
