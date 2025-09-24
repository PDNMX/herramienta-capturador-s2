import { createDirectus, rest, authentication, readItems, createItem, updateItem, deleteItem } from '@directus/sdk'

interface DirectusUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: {
    id: string
    name: string
  }
  avatar?: string
  status: string
  last_access?: string
}

interface DirectusSchema {
  directus_users: DirectusUser[]
  servidores_publicos: any[]
  contrataciones_publicas: any[]
  expedientes: any[]
  documentos: any[]
}

export class DirectusClient {
  private client

  constructor() {
    this.client = createDirectus<DirectusSchema>(
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8055'
    )
      .with(rest())
      .with(authentication())
  }

  async login(email: string, password: string) {
    try {
      await this.client.login(email, password)
      const user = await this.client.request(
        readItems('directus_users', {
          filter: { email: { _eq: email } },
          fields: ['*', 'role.name']
        })
      )
      return { user: user[0] }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async logout() {
    try {
      await this.client.logout()
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  async getItems(collection: string, query?: any) {
    try {
      return await this.client.request(readItems(collection, query))
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error)
      throw error
    }
  }

  async createItem(collection: string, data: any) {
    try {
      return await this.client.request(createItem(collection, data))
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error)
      throw error
    }
  }

  async updateItem(collection: string, id: string, data: any) {
    try {
      return await this.client.request(updateItem(collection, id, data))
    } catch (error) {
      console.error(`Error updating item ${id} in ${collection}:`, error)
      throw error
    }
  }

  async deleteItem(collection: string, id: string) {
    try {
      return await this.client.request(deleteItem(collection, id))
    } catch (error) {
      console.error(`Error deleting item ${id} from ${collection}:`, error)
      throw error
    }
  }

  async uploadFile(file: FormData) {
    try {
      // File upload implementation would go here
      console.log('File upload functionality would be implemented here')
      return null
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  async getFile(id: string) {
    try {
      // File retrieval implementation would go here
      console.log('File retrieval functionality would be implemented here')
      return null
    } catch (error) {
      console.error(`Error getting file ${id}:`, error)
      throw error
    }
  }

  // Specific methods for S2 system
  async getServidoresPublicos(filters?: any) {
    return this.getItems('servidores_publicos', {
      filter: filters,
      sort: ['-date_created'],
      limit: -1
    })
  }

  async getContrataciones(filters?: any) {
    return this.getItems('contrataciones_publicas', {
      filter: filters,
      sort: ['-date_created'],
      limit: -1
    })
  }

  async getExpedientes(filters?: any) {
    return this.getItems('expedientes', {
      filter: filters,
      sort: ['-date_created'],
      limit: -1
    })
  }

  async getDashboardStats() {
    try {
      const [servidores, contrataciones, expedientes] = await Promise.all([
        this.getItems('servidores_publicos', { aggregate: { count: '*' } }),
        this.getItems('contrataciones_publicas', { aggregate: { count: '*' } }),
        this.getItems('expedientes', { aggregate: { count: '*' } })
      ])

      return {
        total_servidores: servidores.length || 0,
        total_contrataciones: contrataciones.length || 0,
        total_expedientes: expedientes.length || 0,
        contrataciones_activas: 0, // Will be calculated based on status
        servidores_activos: 0, // Will be calculated based on status
        expedientes_pendientes: 0, // Will be calculated based on status
        monto_total_contrataciones: 0, // Will be calculated from sum
        promedio_duracion_procedimientos: 0 // Will be calculated
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }
}

export const directusClient = new DirectusClient()