export default function TagChip({icon, name, selected, onClick, size}) {

    return (<div
        onClick={onClick}
        className="px-2 py-1"
        style={{
            backgroundColor:  selected ? '#FA7239' : 'rgba(255,255,255,0.8)',
            border: '2.5px solid #FA7239',
            borderRadius: '20px',
            fontSize: size === 'md' ? '18px' : '18px',
            color: selected ? 'white' : '#FA7239',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            direction: 'row',
           
            
        }}
    >
        <div className=" px-2">{icon}</div>
        <div className="px-2 fw-light">{name}</div>
    </div>);




}
