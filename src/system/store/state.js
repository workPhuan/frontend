import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import {getEAES,getDAES} from '@/system/engine/security.js'

var serializer = {
    read: (v) => v ? JSON.parse(getDAES(v)) : null,
    write: (v) => getEAES(JSON.stringify(v)),
}

export const languagePanel = useLocalStorage('languagePanel', 'none',{serializer: serializer})

export const currentLanguage = useLocalStorage('currentLanguage', 'en',{serializer: serializer})

export const sidebarPanel = useLocalStorage('sidebarPanel', 'close',{serializer: serializer})

export const accountDetail = useLocalStorage('accountDetail', {},{serializer: serializer})

export const pendingWithdraw = useLocalStorage('pendingWithdraw', '0',{serializer: serializer})

export const storeAjaxTableDetail = useLocalStorage('ajaxtabledetail', '',{serializer: serializer})
export const storeTempID = useSessionStorage('tempid', '',{serializer: serializer})
export const storeTempID2 = useSessionStorage('tempid2', '',{serializer: serializer})

