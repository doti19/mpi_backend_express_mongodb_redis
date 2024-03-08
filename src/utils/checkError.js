const checkError= (data) =>{
    if(data instanceof Error){
        console.log('check Error returned error')
        throw new Error(data);
    }
    else{
        console.log('check error returned data')
        // console.log(data)
        return data;
    }
}

module.exports = {
    checkError,
}