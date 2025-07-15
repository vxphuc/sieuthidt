export const getCart = () => {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
}

export const saveCart = (cart) =>{
    localStorage.setItem('cart', JSON.stringify(cart))
}

export const getName = () => {
    const name = localStorage.getItem('name')
    return name ? JSON.parse(name) : ''
}

export const saveName = (name) =>{
    localStorage.setItem('name', JSON.stringify(name))
}

export const getAddress = () =>{
    const address = localStorage.getItem('address')
    return address ? JSON.parse(address) : ''
}

export const saveAddress = (address) =>{
    localStorage.setItem('address', JSON.stringify(address))
}