export default MayakCategory

interface MayakCategory {
    favourite: string
    id: number
    subject_id: number
    link: string
    products_count: number
    rating: number
    all_revenue: string
    sold_products_count: number
    sold_products_pst: string
    count_skus_80_revenue: number
    pst_skus_80_revenue: string
    min_price_all: string
    max_price_all: string
    avg_price_all: string
    min_price_sold: string
    max_price_sold: string
    avg_price_sold: string
    rating_sold: number
    lost_revenue: string
    lost_sales: number
    share_lost_revenue: number
    avg_revenue_by_sku: number
    all_revenue_sort: number
    min_price_all_sort: number
    max_price_all_sort: number
    avg_price_all_sort: number
    min_price_sold_sort: number
    max_price_sold_sort: number
    avg_price_sold_sort: number
    lost_revenue_sort: number
}
