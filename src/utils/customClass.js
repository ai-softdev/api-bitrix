export const customClass = (status) => {
    switch(status){
        case 2:
            return 'expectation';
        case 3:
            return 'in-progress';
        case 4:
            return 'control';
        case 5:
            return 'done';
        case 6:
            return 'postponed';
        default:
            break
    }
}