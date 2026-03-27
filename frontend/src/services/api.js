export const getSpotData = async () => {
    try {
        const response = await fetch('/api/spot/latest')
        if (!response.ok) {
            return null
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

export const getSpotVariation = async () => {
    try {
        const response = await fetch('/api/spot/variation')
        if (!response.ok) {
            return null
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}