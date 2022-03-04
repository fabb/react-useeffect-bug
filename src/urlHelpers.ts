// returns the first string from the given query parameter or headers
export const getFirstString = (queryParameter?: string | string[]): string | undefined => {
    if (typeof queryParameter === 'undefined') {
        return undefined
    } else if (typeof queryParameter === 'string') {
        return queryParameter
    } else if (queryParameter instanceof Array) {
        return queryParameter[0]
    } else {
        return undefined
    }
}

export const removeQueryString = (url: string) => {
    return url.replace(/\?.*/, '')
}
