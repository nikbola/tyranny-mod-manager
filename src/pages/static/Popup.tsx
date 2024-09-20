import '../../style/static/Popup.css';

type PopupType = 'info' | 'success' | 'warning' | 'error';

interface PopupProps {
    id: string;
    type: PopupType;
    message: string;
}

interface PopupContainerProps {
    popups: PopupProps[];
}

const Popup: React.FC<PopupProps> = ({ type, message }) => {

    function copyText(message: string) {
        navigator.clipboard.writeText(message);
    }

    function removePopup(popup: Element | null) {
        if (popup)
            popup.remove();
    }

    return (
        <div className={`popup ${type}`}>
            <span className="popup-message">{message}</span>
            <svg onClick={() => copyText(message)} className="copy-btn" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 512 512"><path d="M368 48h-11.41a8 8 0 01-7.44-5.08A42.18 42.18 0 00309.87 16H202.13a42.18 42.18 0 00-39.28 26.92 8 8 0 01-7.44 5.08H144a64 64 0 00-64 64v320a64 64 0 0064 64h224a64 64 0 0064-64V112a64 64 0 00-64-64zm-48.13 64H192.13a16 16 0 010-32h127.74a16 16 0 010 32z" /></svg>
            <svg onClick={(e) => {
                const popupElement = e.currentTarget.closest('.popup');
                removePopup(popupElement);
            }} className="close-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm86.63 272L320 342.63l-64-64-64 64L169.37 320l64-64-64-64L192 169.37l64 64 64-64L342.63 192l-64 64z" /></svg>
        </div>
    );
};

const PopupContainer: React.FC<PopupContainerProps> = ({ popups }) => {

    return (
        <div className="popup-container">
            {popups.map(popup => (
                <Popup key={popup.id} id={popup.id} type={popup.type} message={popup.message} />
            ))}
        </div>
    );
};

export default PopupContainer;
