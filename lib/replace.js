
  function  fn(str){
    let res; res = str.replace(/[^0-9]/g,"")
    return res;
}//정규 표현식 함수 문자 제거


module.exports ={
  //숫자 정렬 함수
  numberSort: (array)=>{
  array.sort((a,b)=>{
  return fn(a) - fn(b)
    })
},fn:(str)=>{
    let res; res = str.replace(/[^0-9]/g,"")
    return res;
}
}
