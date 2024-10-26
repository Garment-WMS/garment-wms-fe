import { get } from "../ApiCaller"

const testAuthApi = '/auth/test'

export const testApi = {
    testAuth: () => {
        return get(testAuthApi)
    }
}