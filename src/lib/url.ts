/*
 * Created on Wed Feb 14 2024
 * Author: Connor Doman
 */

export function searchParamsToQueryString(
    searchParams: { [key: string]: string | string[] | undefined } | undefined
): string {
    if (searchParams) {
        let params = new URLSearchParams();

        for (let key in searchParams) {
            let value = searchParams[key];

            if (Array.isArray(value)) {
                value.forEach((val) => params.append(key, val));
            } else if (value !== undefined) {
                params.append(key, value);
            }
        }

        return "?" + params.toString();
    }
    return "";
}
