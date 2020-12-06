/**
 *
 * Return date in dd/mm/yyyy format
 * @export
 * @param {Date} date
 * @returns {string}
 */
export function getIsraelDateFormat(date: Date): string {
    const dateArrString = date.toJSON().slice(0,10).split('-');
    return `${dateArrString[2]}/${dateArrString[1]}/${dateArrString[0]}`;
}
/**
 *
 * Return time in hh:mm format
 * @export
 * @param {Date} date
 * @returns {string}
 */
export function getIsraelTimeFormat(date: Date): string {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${hour}:${minutes}`;
}