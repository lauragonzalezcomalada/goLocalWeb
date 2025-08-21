export default function DateCard({ dia,mes }) {

   
    return (<div className="d-flex align-items-center" style={{
        height: '85px', width: '85px', backgroundColor: 'rgba(18, 18, 18, 0.8)', borderRadius: '1rem', overflow: 'hidden', display: 'flex',
        flexDirection: 'column'
    }}>
        <p className="mt-2 fw-bold" style={{fontSize:'35px', lineHeight:'1'}} >
            {dia}
        </p>
        <p className="fw-bold" style={
            {fontSize:'25px', lineHeight:'0'}
        }>
            {mes}
        </p>

    </div>)

}