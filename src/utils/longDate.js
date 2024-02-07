export const formatLongDate= (dateTimeString) => {
    const options = {
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    const formattedDate = new Date(dateTimeString).toLocaleDateString("ru-RU", options);

    return formattedDate;
}