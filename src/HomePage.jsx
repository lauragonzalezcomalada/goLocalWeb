
import screenshot from './assets/goLocalDocs1.png';


// HomePage.jsx
export default function HomePage() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
     
        overflowY: 'auto',
        color: 'white',
        paddingTop: '56px',
        boxSizing: 'border-box',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      <div style={{height:'80vh', width:'auto', display:'flex', flexAlign:'right'}}>
       <img src={screenshot} />
      </div>
     
    </div>
  )
}
