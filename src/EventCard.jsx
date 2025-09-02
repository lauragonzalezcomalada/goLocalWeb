import { SERVER_IP, TOKEN_STORAGE_KEY } from './constants.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom'

import TagChip from './TagChip.jsx'

export default function EventCard({ uuid, tipo, activo, name, imageUrl, gratis, shortDesc, tags, asistentes }) {

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/eventDetail', { state: { uuid, tipo } })
  }

  return (
    <div
      onClick={handleClick}
      className="event-card card mb-3"
      style={{
        minHeight: '220px',
        width: '98%',
        margin: '0 auto',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/*part de dalt*/}
      <div style={{ flex: 1, position: 'relative', minHeight: '150px' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'expand' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#ffc14577' }} />
        )}



        <div
          className="position-absolute top-0 start-0 mt-2" style={{display:'flex', flexDirection:'row'}}
        >
          <div className="ms-2 px-2 d-flex gap-2 align-items-center" style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
            border: '1px solid #FA7239', // Bootstrap primary
            borderRadius: '18px',
            fontSize: '15px',
            lineHeight: '2',
            zIndex: 2,
            

          }}>
            {gratis ? <i class="bi bi-person-fill-check"></i> : <i class="bi bi-ticket-perforated"></i>}
            <p className="mb-0">{asistentes}</p>

          </div>


          <div className=" d-flex align-items-center justify-content-center ms-1 mt-1" style={{ borderRadius: '50%', height: '25px', width: '25px', border: '1px solid rgba(27, 80, 6, 0.9)', backgroundColor: activo === true ? 'rgba(54, 160, 9, 1)' : 'rgba(221, 8, 8,1)' }}>
            <i class="bi bi-check2"></i>
          </div>

        </div>

        {gratis && (
          <div
            className="position-absolute top-0 end-0 m-2 px-2 py-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              border: '2px solid #FA7239', // Bootstrap primary
              borderRadius: '20px',
              fontSize: '15px',
              zIndex: 2,
            }}
          >
            GRATIS
          </div>
        )}


      </div>
      {/*part de baix*/}
      <div
        style={{

          backgroundColor: '#FA7239', // Bootstrap primary
          color: 'white',
          padding: '8px',

        }}
      >
        <div className="d-flex align-items-center">

          <div className="ms-2 d-flex flex-column" style={{ flex: 1 }}>
            <div className="fw-light" style={{ fontSize: '20px' }}>{name}</div>
            {shortDesc != null ? (
              <div className="fw-lighter" style={{ fontSize: '18px' }}>{shortDesc}</div>
            ) : <div style={{ height: '5px' }}></div>
            }
            <div className="mt-auto">
              {tags?.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {tags.map((tag) => (

                    <TagChip icon={tag.icon} name={tag.name} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-1'></div>
      </div>
    </div>
  );
}


//   <img src={imageUrl} alt={name} className="card-img-top" />

/*<div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{date}</p>
      </div>*/


/*// ActivityCard.jsx
import React from 'react';
import './ActivityCard.css'; // para bordes y overlay

function ActivityCard({ activity }) {
  return (
    <div
      className="activity-card card mb-3"
      style={{
        height: '220px',
        width: '95%',
        margin: '0 auto',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Parte superior con imagen }
      <div style={{ flex: 1, position: 'relative' }}>
        {activity.imageUrl ? (
          <img
            src={activity.imageUrl}
            alt={activity.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: 'blue' }} />
        )}

        {activity.gratis && (
          <div
            className="position-absolute top-0 end-0 m-2 px-2 py-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              border: '2px solid rgba(13,110,253,0.8)', // Bootstrap primary
              borderRadius: '12px',
              fontSize: '15px',
              zIndex: 2,
            }}
          >
            GRATIS
          </div>
        )}
      </div>

      {/* Parte inferior con info }
      <div
        style={{
          flex: 1,
          backgroundColor: '#0d6efd', // Bootstrap primary
          color: 'white',
          padding: '8px',
        }}
      >
        <div className="d-flex align-items-center">
          {/* DateBox sería otro componente s}
          <DateBox date={activity.dateTime} />
          <div className="ms-2 d-flex flex-column" style={{ flex: 1 }}>
            <div style={{ fontSize: '25px' }}>{activity.name}</div>
            {activity.shortDesc && (
              <div style={{ fontSize: '20px' }}>{activity.shortDesc}</div>
            )}
            <div className="mt-auto">
              {activity.tags?.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {activity.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-2 py-1"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        border: '1.5px solid #0d6efd',
                        borderRadius: '10px',
                        fontSize: '12px',
                        color: '#0d6efd',
                      }}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
*/