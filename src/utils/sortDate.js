export const sortDate = (array) => {
    let sortedArray = array.sort((a, b) => {
        const deadlineA = getClosestFutureDeadline(a);
        const deadlineB = getClosestFutureDeadline(b);

        // Сравниваем полученные ближайшие будущие дедлайны
        if (deadlineA > deadlineB) {
            return 1;
        } else if (deadlineA < deadlineB) {
            return -1;
        } else {
            return 0;
        }
    });

    function getClosestFutureDeadline(item) {
        // Преобразуем строки в объекты даты
        const parseDate = (dateString) => new Date(dateString);

        // Извлекаем дедлайны из элемента
        const deadlines = [parseDate(item.deadline), ...item.children.map(child => parseDate(child.deadline))];

        // Фильтруем недопустимые значения и будущие дедлайны
        const validFutureDeadlines = deadlines.filter(date => date && !isNaN(date) && date > new Date());

        // Если есть будущие дедлайны, находим ближайший
        if (validFutureDeadlines.length > 0) {
            const closestFutureDeadline = validFutureDeadlines.reduce((closest, current) => {
                const timeDiffCurrent = Math.abs(current - new Date());
                const timeDiffClosest = closest ? Math.abs(closest - new Date()) : Infinity;

                return timeDiffCurrent < timeDiffClosest ? current : closest;
            }, null);

            return closestFutureDeadline;
        } else {
            // Если нет будущих дедлайнов, возвращаем null
            return null;
        }
    }

    return sortedArray
}