import { backgroundColor, logoColor } from './constants'
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants'


export default function BecomeCreator() {
    const onSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <div
            style={{
                minHeight: 'calc(100vh - 18vh)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '56px',
                width: '100vw',
                backgroundColor: backgroundColor,
                flexDirection: 'column',
                padding: '2rem'

            }}
        >
            <div style={{ width: '100%', fontSize: '23px', color: logoColor, justifyContent: 'center', textAlign: 'center', fontWeight: 600, lineHeight: '3rem' }}>
                Desde GoLocal queremos agradecerte que quieras seguir sumando a la comunidad y ser creador de eventos en nuestra plataforma.  <br />
                Ser creador de eventos te permitirá compartir tus experiencias, talentos y pasiones con una audiencia más amplia, al mismo tiempo que generas ingresos adicionales.<br />

                Al convertirte en creador, tendrás acceso a herramientas exclusivas para gestionar tus eventos, promocionarlos y conectar con tus asistentes de manera efectiva.<br />

                Estamos comprometidos en brindarte todo el apoyo necesario para que tu experiencia como creador sea exitosa y gratificante.<br />

                ¡Gracias por ser parte de GoLocal y por contribuir a hacer de nuestra plataforma un espacio vibrante y diverso!<br />


            </div>
            <div style={{ padding: '5rem', width: '100%' }}>
                <form onSubmit={onSubmit} style={{ width: '100%', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                    <h3 style={{ textAlign: 'center', fontSize: '30px', color: logoColor, fontWeight: 900 }}>¡Quiero ser creador de eventos!</h3>
                    <div style={{ display: 'flex', flexDirection: 'row' , alignItems:'space-between', gap:'5rem'}}>
                        <div style={{ display: 'flex', flexDirection: 'column' , width:'100%'}}>

                            <label htmlFor='username' style={{ color: logoColor, fontSize: '20px', fontWeight: 800 }}
                            > USUARIO
                                <input type="text" id="username" name="username" required style={{ width: '100%', padding: '0.5rem', fontSize: '20px', color: logoColor, marginBottom: '1rem' }} />
                            </label>
                            <label htmlFor='password' style={{ color: logoColor, fontSize: '20px', fontWeight: 800 }}
                            > CONTRASEÑA
                                <input type="password" id="password" name="password" required style={{ width: '100%', padding: '0.5rem', fontSize: '20px', color: logoColor, marginBottom: '1rem' }} />
                            </label>

                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width:'100%', justifyContent:'center' }}>
                            <div>
                                <label htmlFor="terms" style={{ fontSize: '18px' }}>
                                    <input type="checkbox" id="terms" required style={{ marginRight: '0.5rem', transform: 'scale(1.5)' ,  accentColor: logoColor,
                                cursor: "pointer", }} />
                                    Acepto los términos y condiciones para ser creador de eventos en GoLocal.
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" style={{ justifyContent: 'center', padding: '0.5rem', fontSize: '25px', color: 'white', fontWeight: 900, backgroundColor: logoColor, borderRadius: '20px', border: '2px solid' + logoColor }}>Enviar solicitud</button>
                    </div>
                </form>
            </div>

        </div>
    );
}
