import {useState, useEffect} from 'react';
import {getSpotData} from '../services/api.js';

const SpotPrice = () => {
    const [displayData, setDisplayData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSpotData()
            setDisplayData(data)
        }
        fetchData()

    }, [])
}

export default SpotPrice

