export const formatProgress = (tasks, id) => {
    const progress = Number(id) ? countChildrenProgress() : countParentProgress()

    function countParentProgress(){
        const statusValues = {
            2: 0,
            3: 10,
            4: 50,
            5: 100,
            6: 0,
        };

        let result = 0;
        let subtask = 0

        for (let i = 0; i < tasks.length; i++) {
            const parentId = Number(tasks[i].parentId);
            const status = Number(tasks[i].status);

            if (parentId && statusValues.hasOwnProperty(status)) {
                subtask += 1
                result += statusValues[status];
            }
        }

        result = result / subtask

        return result
    }

    function countChildrenProgress(){
        return 100
    }

    return progress

}