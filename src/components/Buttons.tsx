interface ButtonsProps {
    setShape: (shape: string) => void; 
    shape: string;
}

function Buttons({ setShape, shape }: ButtonsProps) {


    return(
        <>
            <button 
                onClick={() => setShape('rectangle')}
                style={{ backgroundColor: shape === 'rectangle' ? 'lightgray' : 'transparent' }}
                >rectangle</button>
            <button 
                onClick={() => setShape('circle')}
                style={{ backgroundColor: shape === 'circle' ? 'lightgray' : 'transparent' }}
                >circle</button>
            <button 
                onClick={() => setShape('triangle')}
                style={{ backgroundColor: shape === 'triangle' ? 'lightgray' : 'transparent' }}
                >triangle</button>
            <button 
                onClick={() => setShape('')}
                style={{ backgroundColor: shape === '' ? 'lightgray' : 'transparent' }}
                >none</button>
            <button 
                onClick={() => setShape('clear')}
                style={{ backgroundColor: shape === 'clear' ? 'lightgray' : 'transparent' }}
                >clear</button>
        </>
    )
}


export default Buttons