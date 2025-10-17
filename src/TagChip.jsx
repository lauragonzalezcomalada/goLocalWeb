import { logoColor, orangeColor } from "./constants";

export default function TagChip({icon, name, selected, onClick, size}) {

    return (<div
        onClick={onClick}
        className="px-2 py-1"
        style={{
            backgroundColor:  selected ? logoColor : 'rgba(255,255,255,0.8)',
            border: '2.5px solid '+logoColor,
            borderRadius: '20px',
            fontSize: size === 'md' ? '18px' : '22px',
            color: selected ? 'white' : logoColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            direction: 'row',
           
            
        }}
    >
        <div className=" px-2">{icon}</div>
        <div className="px-2">{name}</div>
    </div>);




}
