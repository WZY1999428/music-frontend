export function formatFileSize(size) {
    if (size == null || Number.isNaN(Number(size))) {
        return '-';
    }

    let value = Number(size);
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    let unit = 0;

    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit++;
    }

    return `${Number(value.toFixed(2))} ${units[unit]}`;
}