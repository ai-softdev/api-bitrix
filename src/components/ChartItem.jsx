import React, {useContext, useEffect, useRef, useState} from 'react';
import Gantt from "frappe-gantt";
import {Context} from "../main.jsx";
import {formatDate} from "../utils/date.js";
import {formatProgress} from "../utils/progress.js";
import {customClass} from "../utils/customClass.js";
import {formatLongDate} from "../utils/longDate.js";
import {Transition} from "react-transition-group";
import {getFirstLetter} from "../utils/getLetter.js";
import {closestDeadline} from "../utils/closestDeadline.js";

const ChartItem = ({task}) => {
    const [active, setActive] = useState(false)
    const ganttContainer = useRef(null);

    function clicked(){
        setActive(!active)
    }

    useEffect(() => {
        if (active) {
            writeChart();
        }
    }, [active]);

    function writeChart()
    {
        let subtasks2 = []
        subtasks2.push({
            id: task.id,
            parentId: Number(task.parentId),
            dependencies: Number(task.parentId) ? task.parentId : 'parent',
            name: task.title,
            accomplices: Object.values(task.accomplicesData),
            responsible: task.responsible,
            start: formatDate(task.createdDate),
            end: formatDate(task.deadline),
            progress: formatProgress(task, task.parentId),
            custom_class: customClass(Number(task.status)),
            status: task.status
        });

        const subtasks2Mapped = task.children.map((task, index) => ({
            id: task.id,
            parentId: Number(task.parentId),
            dependencies: Number(task.parentId) ? task.parentId : 'parent',
            name: task.title,
            accomplices: Object.values(task.accomplicesData),
            responsible: task.responsible,
            start: formatDate(task.createdDate),
            end: formatDate(task.deadline),
            progress: formatProgress(task, task.parentId),
            custom_class: customClass(Number(task.status)),
            status: task.status
        }));

        const combinedSubtasks2 = subtasks2.concat(subtasks2Mapped);
        console.log(combinedSubtasks2)

        const gantt = new Gantt(ganttContainer.current, combinedSubtasks2, {
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

        gantt.refresh(combinedSubtasks2);
    }
        return (
        <div className={'w-full relative border-b border-gray-200 hover:bg-light_blue transition-all ease-in-out duration-200'}>
            <div
                onClick={()=> clicked()}
                className={'capitalize w-full text-main py-5 px-10 text-lg grid grid-cols-4 items-start cursor-pointer'}
            >
                <p>
                    {task.title}
                </p>
                <p className={'bg-gray-200 w-fit px-3 py-1 text-gray-500 font-medium rounded-2xl lowercase'}>
                    {formatLongDate(task.createdDate)}
                </p>
                <p className={'bg-gray-200 w-fit px-3 py-1 text-gray-500 font-medium rounded-2xl lowercase'}>
                    {formatLongDate(task.deadline)}
                </p>
                <p className={'bg-gray-200 w-fit px-3 py-1 text-gray-500 font-medium rounded-2xl lowercase'}>
                    {closestDeadline(task).date
                        ? formatLongDate(closestDeadline(task).date)
                        : 'No upcoming deadlines'}
                </p>
            </div>
            {active && (
                <Transition in={active} timeout={200}>
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
            )}
        </div>
    );
};

export default ChartItem;