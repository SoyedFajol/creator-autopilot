import { SignJWT, jwtVerify } from 'jose';

export interface WorkflowTokenPayload {
  sub: string; // e.g. 'github-actions-worker'
  role: 'workflow_worker';
  brandId?: string;
  action: 'production' | 'publishing' | 'analytics' | 'backup';
}

/**
 * Creates a signed JWT for workflow worker tasks.
 * Valid for up to 30 minutes.
 */
export async function createWorkflowToken(
  payload: WorkflowTokenPayload,
  secretString: string
): Promise<string> {
  const secret = new TextEncoder().encode(secretString);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('creator-autopilot-dashboard')
    .setAudience('creator-autopilot-api')
    .setExpirationTime('30m')
    .sign(secret);
}

/**
 * Validates a workflow JWT token.
 * Rejects expired tokens, invalid signatures, or non-worker roles.
 */
export async function verifyWorkflowToken(
  token: string,
  secretString: string
): Promise<WorkflowTokenPayload> {
  const secret = new TextEncoder().encode(secretString);

  const { payload } = await jwtVerify(token, secret, {
    issuer: 'creator-autopilot-dashboard',
    audience: 'creator-autopilot-api',
  });

  if (payload.role !== 'workflow_worker') {
    throw new Error('Unauthorized role in workflow token');
  }

  return {
    sub: payload.sub as string,
    role: 'workflow_worker',
    brandId: payload.brandId as string | undefined,
    action: payload.action as WorkflowTokenPayload['action'],
  };
}
