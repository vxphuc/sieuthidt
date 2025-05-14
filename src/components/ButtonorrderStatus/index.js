function ButtonOrderStatus({children, className, onStatusClick, ...restProps}) {
    const handleclick = () =>{
       const data = restProps.datastatus
        if(onStatusClick){
            onStatusClick(data)
        }
    }
    return ( <button onClick={handleclick} {...restProps} className={className}>{children}</button> );
}

export default ButtonOrderStatus;