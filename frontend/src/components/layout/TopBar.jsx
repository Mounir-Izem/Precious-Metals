const TopBar = ({fixingDate}) => {
    
    return (
        <main>
            <h1>Precious Metals</h1>
            <div>{fixingDate}</div>
            <button>FR/EN</button>
        </main>
    )
}

export default TopBar;