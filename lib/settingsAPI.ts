import { BaseAPI } from './baseAPI'

export interface SystemSettings {
  id?: string
  // System Configuration
  system_name: string
  system_version: string
  maintenance_mode: boolean
  debug_mode: boolean
  
  // Email Configuration
  email_enabled: boolean
  smtp_host: string
  smtp_port: string
  smtp_username: string
  smtp_security: string
  
  // Notification Settings
  notifications_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  
  // Security Settings
  session_timeout: string
  password_policy: string
  two_factor_auth: boolean
  
  // Backup Settings
  auto_backup: boolean
  backup_frequency: string
  backup_retention: string
  
  created_at?: string
  updated_at?: string
}

export interface SettingsResponse {
  id: string
  system_name: string
  system_version: string
  maintenance_mode: boolean
  debug_mode: boolean
  email_enabled: boolean
  smtp_host: string
  smtp_port: string
  smtp_username: string
  smtp_security: string
  notifications_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  session_timeout: string
  password_policy: string
  two_factor_auth: boolean
  auto_backup: boolean
  backup_frequency: string
  backup_retention: string
  created_at: string
  updated_at: string
}

export class SettingsAPI extends BaseAPI {
  private readonly endpoint = '/api/settings'

  /**
   * Get current system settings
   */
  async getSettings(token: string): Promise<SettingsResponse> {
    return this.makeRequest(`${this.endpoint}`, {
      method: 'GET',
      token
    })
  }

  /**
   * Update system settings
   */
  async updateSettings(settings: SystemSettings, token: string): Promise<SettingsResponse> {
    // Remove readonly fields
    const { id, created_at, updated_at, ...settingsData } = settings
    
    return this.makeRequest(`${this.endpoint}`, {
      method: 'PUT',
      body: settingsData,
      token
    })
  }

  /**
   * Reset settings to default values
   */
  async resetSettings(token: string): Promise<SettingsResponse> {
    return this.makeRequest(`${this.endpoint}/reset`, {
      method: 'POST',
      token
    })
  }

  /**
   * Get default settings values
   */
  async getDefaultSettings(token: string): Promise<SystemSettings> {
    return this.makeRequest(`${this.endpoint}/defaults`, {
      method: 'GET',
      token
    })
  }
}

// Export singleton instance
export const settingsAPI = new SettingsAPI()
