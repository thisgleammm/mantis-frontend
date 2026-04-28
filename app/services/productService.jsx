const BASE_URL = "https://mantis-backend.fly.dev/api/v1"

export const getAllProducts = async () => {
    const response = await fetch(`${BASE_URL}/products`)
    const data = await response.json()
    return data
}

export const getProductById = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`)
    const data = await response.json()
    return data
}

export const getProductBySlug = async (slug) => {
    const response = await fetch(`${BASE_URL}/products/${slug}`)
    const data = await response.json()
    return data
}

export const getAllCategories = async (slug) => {
    const response = await fetch(`${BASE_URL}/categories`)
    const data = await response.json()
    return data
}

export const getAllCategoriesById = async (id) => {
    const response = await fetch(`${BASE_URL}/categories/${id}`)
    const data = await response.json()
    return data
}