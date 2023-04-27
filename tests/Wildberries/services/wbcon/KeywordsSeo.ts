import KeywordsSeoItem from './KeywordsSeoItem'

export default interface KeywordsSeo {
    week: {
        data: {
            list: KeywordsSeoItem[]
        }
    }
    month: {
        data: {
            list: KeywordsSeoItem[]
        }
    }
}
