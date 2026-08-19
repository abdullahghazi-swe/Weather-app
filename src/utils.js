const dateFormater = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const timeFormater = new Intl.DateTimeFormat('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })


export function formateTime(str) {
    const time = new Date(str)
    return `${dateFormater.format(time)} · ${timeFormater.format(time)}`
}