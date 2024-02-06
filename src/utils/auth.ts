import Cookies from 'js-cookie'

/**
 * JWT鉴权
 */

const TokenKey = "Wenxiu-Token"

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token: string) {
    return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}