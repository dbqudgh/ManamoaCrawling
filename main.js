const {rtManaGaInfo,createdJson,imgsLoad} = require('./lib/core')
const mainDir = require('./lib/config').mainDir
const options = require('./lib/config').options


// function init()
async function init(){
    //함수 시작부분
    try{
        const info = await rtManaGaInfo(options) // 만화정보를 리턴해줌

        if(info.state === true){  
            await createdJson(info) // 그걸사용하여 json 파일에 정보 담아주기
            await imgsLoad(info,options,mainDir)// 정보와 request 옵션과 디렉토리 정보를 줍시다.
        }
        
        else{ //만약 상태가 undefined
            console.log('faild')
        }

    }         
    catch(err){
        console.log(err)
    }

}init()


/*
오류 적어두는곳

1.태그 오류 중간에 \n 문자 그후 태그가 한번더 들어감 나중에 태그 사용할일 있을때 확인해주면 될 것 같음 해결
2.이미지 링크 중간에 [ 문자 들어간거 제거 해결



*/



