export const closestDeadline = (item) => {
    const parseDate = (dateString) => new Date(dateString);

    const deadlines = [parseDate(item.deadline), ...item.children.map(child => parseDate(child.deadline))];

    const validFutureDeadlines = deadlines.filter(date => date && !isNaN(date) && date > new Date());

    if (validFutureDeadlines.length > 0) {
        const closestFutureDeadline = validFutureDeadlines.reduce((closest, current, index) => {
            const timeDiffCurrent = Math.abs(current - new Date());
            const timeDiffClosest = closest ? Math.abs(closest.date - new Date()) : Infinity;

            return timeDiffCurrent < timeDiffClosest ? { date: current, index: index } : closest;
        }, { date: null, index: -1 });

        return closestFutureDeadline;
    } else {
        return { date: null, index: -1 };
    }

}