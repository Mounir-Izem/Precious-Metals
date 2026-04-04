export const getSpotData = async () => {
    try {
        const response = await fetch('/api/spot/latest');
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};
