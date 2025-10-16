import { useState } from "react";
import { backgroundColor, logoColor } from './constants'

export default function RecoverPwd() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(API_BASE_URL + "/auth/send_mail_for_pwd_reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true); // siempre “éxito” (respuesta genérica)
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return <p>Si el correo existe, te enviamos instrucciones para restablecer tu contraseña.</p>;
  }

  return (
       <div
          style={{
            height: 'calc(100vh - 18vh)',
           display: 'grid',
        placeItems: 'center',
            paddingTop: '56px',
           
         
            width:'100vw',
            backgroundColor: backgroundColor
          }}
        >
          <div style={{display:'flex', alignItems:'center', width:'100%'}}>

          
    <form onSubmit={onSubmit} style={{width:'100%', padding:'2rem',display:'flex', flexDirection:'column', alignItems: 'flex-start',}}>
      <label style={{fontSize:'20px', fontWeight:800, color:logoColor}}>¿Con qué mail te registraste?</label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
         onInvalid={(e) => {
    if (e.currentTarget.validity.valueMissing) {
      e.currentTarget.setCustomValidity("Este campo es obligatorio.");
    } else if (e.currentTarget.validity.typeMismatch) {
      e.currentTarget.setCustomValidity("Introduce un correo válido (ej: nombre@dominio.com).");
    } else {
      e.currentTarget.setCustomValidity("");
    }
  }}
        style={{ width: "60%", padding: "0.5rem", marginTop: 4, marginBottom: 12 , borderRadius:'20px', border:'3px solid '+logoColor}}
      />
      <button type="submit" disabled={loading} style={{width:'15vw', backgroundColor:logoColor, color: 'white', borderRadius:'20px', fontSize:'25px', lineHeight:1, fontWeight:300}}>
        {loading ? "Enviando..." : "Enviar enlace"}
      </button>
    </form>
      </div>
      </div>
  );

}
