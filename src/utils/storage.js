export function setItem(key, value) {
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}


export function getItem(key) {
    const value = localStorage.getItem(key);
    try {
        return JSON.parse(value);
    } catch (error) {
        return value;
    }
}


export function storageClear() {
    localStorage.clear();
}


export function removeItem(key) {
    localStorage.removeItem(key);
}

export function getToken(){
    return getItem('token');
}

export function setToken(token){
    setItem('token', token);
}

export function removeToken(){
    removeItem('token');
}
