// Okabe-Ito palette (distinguishable with common colour blindness); green lightened for 4.5:1 contrast on gray-800
export const STRAIN_COLORS = {
    H5N1: '#56b4e9',
    H5N2: '#e69f00',
    H7N2: '#2bbf8e',
    H7N8: '#cc79a7'
} as const;

export const STRAIN_COLORS_TRANSPARENT = {
    H5N1: 'rgba(86, 180, 233, 0.8)',
    H5N2: 'rgba(230, 159, 0, 0.8)',
    H7N2: 'rgba(43, 191, 142, 0.8)',
    H7N8: 'rgba(204, 121, 167, 0.8)'
} as const;

export const WILD_LIVESTOCK_CHART_COLORS = {
    Wild: '#56b4e9',
    Livestock: '#e69f00'
} as const;

export const SCROLLBAR_COLORS = {
    Colors: '#4B5563 #1F2937'
}
