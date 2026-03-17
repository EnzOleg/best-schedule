const API_URL = 'http://localhost:8080/graphql'

export async function graphqlRequest(query, variables = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: 'Bearer ' + token })
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  return result.data
}