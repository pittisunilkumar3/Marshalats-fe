// API utility functions for student management
import { BaseAPI } from './baseAPI'

export interface StudentCreateData {
  personal_info: {
    first_name: string
    last_name: string
    email: string
    phone: string
    date_of_birth: string
    gender: string
  }
  address: {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
  }
  emergency_contact: {
    name: string
    relationship: string
    phone: string
  }
  enrollment: {
    branch_id: string
    course_id: string
    enrollment_date: string
  }
  settings: {
    active: boolean
  }
}

export interface StudentResponse {
  message: string
  student_id: string
}

class StudentAPI extends BaseAPI {
  async createStudent(data: StudentCreateData, token: string): Promise<StudentResponse> {
    return await this.makeRequest('/api/students', {
      method: 'POST',
      body: data,
      token
    })
  }

  async getStudents(token: string, params?: {
    branch_id?: string
    course_id?: string
    active?: boolean
  }): Promise<any> {
    let endpoint = '/api/students'
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
      if (searchParams.toString()) {
        endpoint += `?${searchParams.toString()}`
      }
    }

    return await this.makeRequest(endpoint, {
      method: 'GET',
      token
    })
  }

  async getStudentById(studentId: string, token: string): Promise<any> {
    return await this.makeRequest(`/api/students/${studentId}`, {
      method: 'GET',
      token
    })
  }

  async updateStudent(studentId: string, data: Partial<StudentCreateData>, token: string): Promise<any> {
    return await this.makeRequest(`/api/students/${studentId}`, {
      method: 'PUT',
      body: data,
      token
    })
  }

  async deleteStudent(studentId: string, token: string): Promise<any> {
    return await this.makeRequest(`/api/users/${studentId}`, {
      method: 'DELETE',
      token
    })
  }

  async deactivateStudent(studentId: string, token: string): Promise<any> {
    return await this.makeRequest(`/api/users/${studentId}/deactivate`, {
      method: 'PATCH',
      token
    })
  }

  // Student-specific methods
  async enrollStudent(studentId: string, courseId: string, token: string): Promise<any> {
    return await this.makeRequest(`/api/students/${studentId}/enroll`, {
      method: 'POST',
      body: { course_id: courseId },
      token
    })
  }

  async getStudentAttendance(studentId: string, token: string, params?: {
    start_date?: string
    end_date?: string
  }): Promise<any> {
    let endpoint = `/api/students/${studentId}/attendance`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value)
        }
      })
      if (searchParams.toString()) {
        endpoint += `?${searchParams.toString()}`
      }
    }

    return await this.makeRequest(endpoint, {
      method: 'GET',
      token
    })
  }
}

export const studentAPI = new StudentAPI()
