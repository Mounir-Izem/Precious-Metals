export const getSpotData = async () => {
    try {
        const response = await fetch('/api/spot')
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}