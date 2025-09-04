import React from 'react';

export const Icono = React.forwardRef(({ className, style }, ref) => {
    return <i ref={ref} className={className} style={style} />;
});