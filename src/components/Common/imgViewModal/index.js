import React from 'react'
import LightBox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const imgViewModal = ({ ...props }) => {
    let { open, src, onClose } = props;
    if (open && src)
        return <LightBox
            mainSrc={src}
            onCloseRequest={onClose}
        />
    return null;
}

export default imgViewModal