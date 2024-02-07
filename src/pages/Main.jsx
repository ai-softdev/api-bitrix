import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../main.jsx";
import ChartItem from "../components/ChartItem.jsx";
import Loader from "../components/Loader/Loader.jsx";
import {NavLink} from "react-router-dom";
import {Transition} from "react-transition-group";
import {motion} from "framer-motion";

const Main = () => {
    const {ganttStore} = useContext(Context)
    const [tasks, setTasks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [params, setParams] = useState({
        page: 1,
        limit: 100
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                await ganttStore.loadAllCharts(params);
                setTasks([...tasks, ...ganttStore.getAllCharts]);
            } catch (error) {
                // console.error('Error fetching data:', error);
            }
            finally {
                setIsLoading(false)
            }
        };
        fetchData();
    }, [ganttStore]);

    return (
        <motion.div
            className={'relative px-10 overflow-hidden min-h-[100vh]'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, display: "none" }}
        >
            <h1 className={'font-bold text-white text-center text-3xl py-10'}>
                UZLTECH GANTT
            </h1>
            <Transition in={tasks.length > 0} timeout={200}>
                {(state) => (
                    <div
                        className={`${
                            state === 'entered' ? 'fade-in' : 'fade-out'
                        } flex items-center flex-col bg-white rounded-2xl overflow-hidden`}
                    >
                        <div className={'w-full grid grid-cols-4 items-start py-6 px-10 text-main border-b border-gray-200 text-lg'}>
                            <p>
                                Название
                            </p>
                            <p>
                                Начало
                            </p>
                            <p>
                                Дедлайн
                            </p>
                            <p>
                                Ближайший срок
                            </p>
                        </div>
                        {tasks.map((task, index)=>(
                            // <NavLink
                            //     key={task.id}
                            //     to={`/chart/${task.id}`}
                            //     className={'w-full'}
                            // >
                                <ChartItem task={task} key={task.id}/>
                            // </NavLink>
                        ))}
                    </div>
                )}
            </Transition>
            <Transition in={isLoading} timeout={200} >
                {(state) => (
                    <div className={`${
                        state === 'entered' ? 'fade-in' : 'fade-out'
                    }`}>
                        <Loader/>
                    </div>
                )}
            </Transition>
        </motion.div>
    );
};

export default Main;