export interface LoginDto {
  email: string;
  password: string;
}

export function validateLoginDto(body: Record<string, unknown>): string | null {
  if (!body.email || typeof body.email !== 'string') {
    return 'Email is required';
  }
  if (!body.password || typeof body.password !== 'string') {
    return 'Password is required';
  }
  return null;
}
