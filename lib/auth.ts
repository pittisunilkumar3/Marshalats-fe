// Authentication utility for different backend API formats
export interface AuthConfig {
  tokenType: 'Bearer' | 'API-Key' | 'Token' | 'Custom'
  headerName: string
  tokenValue: string
  customHeaders?: Record<string, string>
}

// Default configurations for common authentication methods
export const authConfigs = {
  jwt: {
    tokenType: 'Bearer' as const,
    headerName: 'Authorization',
    tokenValue: 'valid-super-admin-token'
  },
  apiKey: {
    tokenType: 'API-Key' as const,
    headerName: 'X-API-Key',
    tokenValue: 'your-api-key-here'
  },
  token: {
    tokenType: 'Token' as const,
    headerName: 'Authorization',
    tokenValue: 'your-token-here'
  },
  custom: {
    tokenType: 'Custom' as const,
    headerName: 'Authorization',
    tokenValue: 'custom-token',
    customHeaders: {
      'X-User-Role': 'super_admin',
      'X-App-Version': '1.0.0'
    }
  }
}

// Helper function to format authentication headers
export function formatAuthHeaders(config: AuthConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  // Add main authentication header
  if (config.tokenType === 'Custom') {
    headers[config.headerName] = config.tokenValue
  } else {
    headers[config.headerName] = `${config.tokenType} ${config.tokenValue}`
  }

  // Add any custom headers
  if (config.customHeaders) {
    Object.assign(headers, config.customHeaders)
  }

  return headers
}

// Get current auth configuration (can be overridden via environment)
export function getCurrentAuthConfig(): AuthConfig {
  const authType = process.env.NEXT_PUBLIC_AUTH_TYPE || 'jwt'
  const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN || 'valid-super-admin-token'
  
  switch (authType) {
    case 'apikey':
      return { ...authConfigs.apiKey, tokenValue: authToken }
    case 'token':
      return { ...authConfigs.token, tokenValue: authToken }
    case 'custom':
      return { ...authConfigs.custom, tokenValue: authToken }
    default:
      return { ...authConfigs.jwt, tokenValue: authToken }
  }
}
