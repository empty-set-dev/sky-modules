// 📊 Data visualization tokens
export default interface BrandCharts {
    colors: {
        categorical: string[]
        sequential: string[]
        diverging: string[]
        qualitative: string[]
    }
    grid: {
        color: string
        strokeWidth: string
        strokeDasharray: string
    }
    axis: {
        color: string
        strokeWidth: string
        fontSize: string
        fontWeight: string
    }
    legend: {
        background: string
        foreground: string
        border: string
        padding: string
        fontSize: string
        spacing: string
    }
    tooltip: {
        background: string
        foreground: string
        border: string
        shadow: string
        padding: string
        fontSize: string
        radius: string
    }
}
