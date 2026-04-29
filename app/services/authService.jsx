const BASE_URL = "https://mantis-backend.fly.dev/api/v1"

export const login = async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    return data
}

export const register = async (username, name, email, password, phone_number) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password, phone_number })
    })
    const data = await response.json()
    return data
}