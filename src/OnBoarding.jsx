// LoginPage.jsx
import { useState, useContext, useEffect } from 'react'
import { logoColor } from './constants';
import { AuthContext } from './AuthContext';
import { Button } from "react-bootstrap";
import { API_BASE_URL, TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from './constants.js'
import TagChip from './TagChip.jsx';
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const navigate = useNavigate()

    const [creador, setCreador] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [page, setPage] = useState(0);
    const [image, setImage] = useState(null);
    const { userProfile, initUserProfile } = useContext(AuthContext);
    const [preview, setPreview] = useState("");

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        async function fetchTags() {

            try {
                var response = await fetch(API_BASE_URL + '/tags/', {
                    method: 'GET',
                })
                var data = await response.json()
                setTags(data)
            } catch (e) {
                console.error('Error fetching tags', e)
            }
        } fetchTags()
    }, []);
    useEffect(() =>
        console.log('userprofile del authcontext', userProfile), []);

    const handleChangeImage = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setImage(f);
        setPreview(URL.createObjectURL(f));
    };
    const toggleTag = (id) => {
        setSelectedTags((prev) =>
            prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
        );
    };

    const _actualizarUsuario = async () => {
        const formData = new FormData();
        console.log('user uuid:', userProfile.uuid);
        formData.append('user_uuid', userProfile.uuid);
        formData.append('description', descripcion);
        formData.append('tags', JSON.stringify(selectedTags));
        console.log('formadata: ', formData);
        if (image) {
            formData.append('image', image);
        }

        const response = await fetch(`${API_BASE_URL}/actualizar_usuario/`, {
            method: 'POST',
            body: formData
        })
        console.log('response', response);
        const data = await response.json()
        if (!response.ok) throw new Error('Login inválido')
        if (creador) {
            navigate('/mainlogged')

        }
        else {
            navigate('/toMobileApp')

        }
    }



    return (
        <div
            style={{
                height: '100vh',
                backgroundColor: '#FEEDEB',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                boxSizing: 'border-box',
                flexDirection: 'column',

            }}
        >
            {page == 0 && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: 'column',
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "20px",
                        }}
                    >
                        <input
                            type="checkbox"
                            style={{
                                transform: "scale(3.5)",
                                accentColor: logoColor,
                                cursor: "pointer",
                            }}
                            checked={creador}
                            onChange={(e) => {
                                setCreador(e.target.checked);
                                setPage(1);
                            }}
                        />
                        <span
                            style={{
                                fontSize: "40px",
                                fontWeight: 300,
                                color: logoColor
                            }}
                        >
                            ¿Quieres registrarte como creador de eventos?
                        </span>
                    </label>
                    <Button variant="outline-primary" onClick={() => setPage(1)} style={{
                        marginTop: '10vh', fontSize: '40px', color: logoColor, borderColor: 'transparent ', borderRadius: '20px', '--bs-btn-color': logoColor,
                        '--bs-btn-hover-bg': '#FA7239',
                        transition: 'all .2s ease',
                    }}>
                        <i className="bi bi-arrow-right"></i>
                    </Button>
                </div>
            )}

            {page == 1 && (
                <div style={{
                    width: '100vw',
                    display: "flex",
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '10vw',
                    alignItems: "center",
                    height: "100vh",
                }}>

                    {/*  <div style={{ textAlign:'end', fontSize: '50px', fontWeight: 300, color: logoColor }}> Bienvenido  <span style={{ fontWeight: 800 }}>{userProfile.username} !</span> </div> */}



                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "50px",
                            fontSize: "40px",
                            fontWeight: 300,
                            width: '100%',
                            color: logoColor

                        }}
                    >
                        Cuentanos un poco sobre ti!
                        <input
                            type="text"
                            style={{
                                width: '60%',
                                padding: '14px 18px',
                                fontSize: '20px',
                                height: '56px',
                                borderRadius: '10px',
                                boxSizing: 'border-box',
                                fontWeight: 300,
                                border: '2px solid ' + logoColor,
                                selectedBorderColor: logoColor,
                            }}
                            onChange={(e) => {
                                setDescripcion(e.target.value);

                            }}
                        />

                    </label>

                    <div style={{ height: '10vh' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>

                        <Button variant="outline-primary" onClick={() => setPage(0)} style={{
                            margintTop: '10vh', fontSize: '40px', color: logoColor, borderColor: 'transparent ', borderRadius: '20px', '--bs-btn-color': logoColor,
                            '--bs-btn-hover-bg': '#FA7239',
                            transition: 'all .2s ease',
                        }}>
                            <i className="bi bi-arrow-left"></i>
                        </Button>
                        <Button variant="outline-primary" onClick={() => setPage(2)} style={{
                            margintTop: '10vh', fontSize: '40px', color: logoColor, borderColor: 'transparent ', borderRadius: '20px', '--bs-btn-color': logoColor,
                            '--bs-btn-hover-bg': '#FA7239',
                            transition: 'all .2s ease',
                        }}>
                            <i className="bi bi-arrow-right"></i>
                        </Button>
                    </div>

                </div>)}
            {page == 2 && (
                <div style={{
                    width: '100vw',

                    display: "flex",
                    padding: '10vw',
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: 'column'
                    , justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '40px', color: logoColor, marginBottom: '10px' }}> ¿Qué tags que identifican?    </span>
                    <div className="d-flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <TagChip
                                key={tag.id}
                                icon={tag.icon}
                                name={tag.name}
                                selected={selectedTags.includes(tag.id)}
                                onClick={() => toggleTag(tag.id)}
                                size="md"

                            />
                        ))}
                    </div>
                    <div style={{ height: '10vh' }}> </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>

                        <Button variant="outline-primary" onClick={() => setPage(1)} style={{

                            fontSize: '40px', color: logoColor, borderColor: 'transparent', borderRadius: '20px', '--bs-btn-color': logoColor,
                            '--bs-btn-hover-bg': '#FA7239',
                            transition: 'all .2s ease',
                        }}>
                            <i className="bi bi-arrow-left"></i>
                        </Button>
                        <Button variant="outline-primary" onClick={() => setPage(3)} style={{

                            fontSize: '40px', color: logoColor, borderColor: 'transparent', borderRadius: '20px', '--bs-btn-color': logoColor,
                            '--bs-btn-hover-bg': '#FA7239',
                            transition: 'all .2s ease',
                        }}>
                            <i className="bi bi-arrow-right"></i>
                        </Button>
                    </div>
                </div>
            )
            }
            {page == 3 && (
                <div style={{
                    width: '100vw',
                    justifyContent: 'center',
                    display: "flex",
                    flexDirection: 'column',
                    padding: '0 10vw',
                    alignItems: "center",
                    height: "100vh",
                    boxSizing: 'border-box',
                }}>


                    <label
                        htmlFor="photo"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: 'center',
                            flexDirection: 'column',
                            fontSize: "40px",
                            fontWeight: 300,
                            width: '100%',
                            color: logoColor, textAlign: 'center',

                        }}
                    >
                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleChangeImage}
                            style={{

                                border: `2px solid ${logoColor}`,
                                borderRadius: "20px",
                                padding: "12px 16px",
                                fontSize: "18px",
                            }}
                        />
                    </label>
                    {preview && (
                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src={preview}
                                alt="Vista previa"
                                style={{ maxWidth: "50%", borderRadius: 20, border: `3px solid ${logoColor}` }}
                            />
                        </div>
                    )}



                    <div style={{ height: '10vh' }}> </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>

                        <Button variant="outline-primary" onClick={() => setPage(2)} style={{

                            fontSize: '40px', color: logoColor, borderColor: 'transparent', borderRadius: '20px', '--bs-btn-color': logoColor,
                            '--bs-btn-hover-bg': '#FA7239',
                            transition: 'all .2s ease',
                        }}>
                            <i className="bi bi-arrow-left"></i>
                        </Button>

                    </div>
                </div>

            )}
            <button onClick={() => navigate('/toMobileApp')
            } style={{ backgroundColor: 'transparent', border: '2px solid' + logoColor, borderRadius: '20px', padding: '12px 25px', position: 'absolute', left: '10vw', bottom: '5vh', color: logoColor, fontSize: '20px' }}>
                LO HAGO LUEGO
            </button>
            {page == 3 && (
                <button onClick={() => _actualizarUsuario()} style={{ backgroundColor: 'transparent', border: '2px solid' + logoColor, borderRadius: '20px', padding: '12px 25px', position: 'absolute', right: '10vw', bottom: '5vh', color: logoColor, fontSize: '20px' }}>
                    CARGAR PERFIL!
                </button>)}
        </div>



    )
}
