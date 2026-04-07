import { ref } from 'vue'
import { graphqlRequest } from '../api'
import { useRouter } from 'vue-router'

// единое состояние
const user = ref(null)
const role = ref(null)

export function useUser() {
  const router = useRouter()
  
  const loadUser = async () => {
    const data = await graphqlRequest(`
      query {
        me {
          name
          email
          role
        }
      }
    `)
    user.value = data.me
    role.value = data.me.role
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    user.value = null
    role.value = null
    router.push('/login')
  }
  
  return {
    user,
    role,
    loadUser,
    logout
  }
}