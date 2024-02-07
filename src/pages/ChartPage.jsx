import React, {useContext, useEffect, useRef, useState} from 'react';
import {Context} from "../main.jsx";
import {formatDate} from "../utils/date.js";
import {formatProgress} from "../utils/progress.js";
import {customClass} from "../utils/customClass.js";
import Gantt from "frappe-gantt";
import {useParams} from "react-router-dom";
import Loader from "../components/Loader/Loader.jsx";
import {CSSTransition, Transition, TransitionGroup} from "react-transition-group";
import {motion} from "framer-motion";
import AnimateBg from "../components/AnimateBg.jsx";
import {getFirstLetter} from "../utils/getLetter.js";

const ChartPage = () => {
    const {id} = useParams()
    const {ganttStore} = useContext(Context)
    const ganttContainer = useRef(null);
    const [subtasks, setSubtasks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [params, setParams] = useState({
        page: 1,
        limit: 100
    })

        function writeChart()
    {
        const subtasks2 = ganttStore.getCurrentChart.map((task, index) => (
            {
                id: task.id,
                parentId: Number(task.parentId),
                dependencies: Number(task.parentId) ? task.parentId : 'parent',
                name: task.title,
                accomplices: Object.values(task.accomplicesData),
                responsible: task.responsible,
                start: formatDate(task.createdDate),
                end: formatDate(task.deadline),
                progress: formatProgress(ganttStore.getCurrentChart, task.parentId),
                custom_class: customClass(Number(task.status)),
                status: task.status
            }
        ))

        console.log(subtasks2)

        const gantt = new Gantt(ganttContainer.current, subtasks2, {
            header_height: 50,
            column_width: 50,
            step: 24,
            view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
            bar_height: 50,
            bar_corner_radius: 30,
            arrow_curve: 5,
            padding: 10,
            view_mode: 'Day',
            date_format: 'YYYY-MM-DD',
            resize: false,
            language: 'ru', // or 'es', 'it', 'ru', 'ptBr', 'fr', 'tr', 'zh', 'de', 'hu'
            custom_popup_html: function (task) {
                return `
                  <div class="w-[250px] h-[160px] overflow-y-auto py-3">
                    <p class="text-dusky_rose text-center font-bold text-xl mb-2">Ответственный:</p>
                    <div class="w-[80px] h-[80px] bg-red-500 rounded-full m-auto flex items-center justify-center text-white text-4xl capitalize">
                        ${getFirstLetter(task.responsible.name)}
                    </div>
                    <span class="block font-bold text-main text-center w-full text-xl">
                        ${task.responsible.name}
                    </span>
                    <p class="text-dusky_rose font-bold text-center text-xl mt-3 border-t pt-3">Соисполнители:</p>
                    ${task.accomplices.length
                        ?
                        task.accomplices.map((accomplice, index) => `
                            <div class="w-[80px] h-[80px] bg-red-500 rounded-full m-auto flex items-center justify-center text-white text-4xl capitalize">
                                ${getFirstLetter(accomplice.name)}
                            </div>
                            <span class="block font-bold text-main text-center w-full text-xl">
                                ${accomplice.name}
                            </span>
                        `).join('')
                        :
                        `
                        <span class="block font-bold text-main text-center w-full text-xl">
                            Нет
                        </span>
                        `
                    }
                    ${task.parentId ? '' : '<p class="font-black text-xl text-white text-center mt-2 border-t pt-2">Завершено: ' + task.progress + '% </p>'}
                  </div>
                `;
            },
            on_click: task => {
                // Handle task click event
                console.log('Task clicked:', task);
            },
        });

        gantt.refresh(subtasks2);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                await ganttStore.loadCurrentChart({page: params.page, limit: params.limit, id: id});
                setSubtasks([...subtasks, ...ganttStore.getCurrentChart]);
                writeChart()
            } catch (error) {
                // console.error('Error fetching data:', error);
            }
            finally {
                setIsLoading(false)
            }
        };
        fetchData();
    }, []);

    return (
        <motion.div
            className={'relative p-10 overflow-hidden min-h-[100vh] flex items-center justify-center'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, display: "none" }}
        >
            <Transition in={subtasks.length > 0} timeout={200}>
                {(state) => (
                    <div
                        className={`${
                            state === 'entered' ? 'fade-in' : 'fade-out'
                        } overflow-hidden rounded-3xl border`}
                    >
                        <div ref={ganttContainer} className=""></div>
                    </div>
                )}
            </Transition>
            <Transition in={isLoading} timeout={200}>
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

export default ChartPage;