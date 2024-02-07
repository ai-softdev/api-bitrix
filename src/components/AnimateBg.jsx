import React from 'react';

const AnimateBg = () => {
    return (
        <div className={'main_back fixed top-0 right-0 left-0 bottom-0 z-[-100] overflow-hidden'}>
            <video className="w-full h-auto" autoPlay loop muted playsInline>
                <source src="/jupiter.webm" type="video/webm"/>
            </video>
        </div>
    );
};

export default AnimateBg;