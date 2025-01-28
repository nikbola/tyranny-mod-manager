import '../../style/static/ContextBar.css'

interface ContextBarProps {
    label: string,
    button: {
        text: string,
        color?: string,
        onClick: () => void
    }[]
}

function ContextBar(props: ContextBarProps) {
    return (
        <>
            <div className="context-bar">
                <div className='context-bar-label'>{props.label}</div>
                <div className="context-bar-section">
                    {props.button.map((button, index) => (
                        <button 
                            key={index} 
                            className="context-button" 
                            onClick={button.onClick} 
                            style={{ backgroundColor: button.color || '' }}
                        >
                            {button.text}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ContextBar;