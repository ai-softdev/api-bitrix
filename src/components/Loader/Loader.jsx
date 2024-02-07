import React from 'react';
import "./loader.css"

const Loader = () => {
    return (
        <div className={'absolute top-0 left-0 right-0  bottom-0 flex items-center gap-1 justify-center flex-col my-10'}>
            <div className={'flex items-center gap-1 flex-col'}>
                <div className={"lds-roller m-auto"}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <span className={'font-medium text-xl text-white'}>
                Идёт загрузка...
            </span>
            </div>
        </div>
    );
};

export default Loader;