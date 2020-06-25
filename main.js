const request = require("request");
const filenamify = require("filenamify");
const cheerio = require("cheerio");
const fs = require('fs');



//mana숫자 < 숫자부분 주기적으로 바꿔줘야하니 나중에 숫자만 입력할수있도록 바꿔줘야함
let number = '48'
const mainUrl = `https://manamoa${number}.net/`

//main directory
const mainDir = 'D:/만화'

//request argument 옵션으로 주기
let options = { // user-Agent 우회하기
    uri: mainUrl,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    json:true 
};


//폴더를 만들어주는 함수
function createFolder(directory,name){//저장할곳, 이름
    const dir = directory+'/'+filenamify(name); // 이름을 알맞게 변환해줍시다

    if(!fs.existsSync(dir)){//폴더가 없다면 생성합니다.
        fs.mkdirSync(dir)
    }
}

//json createdfunction
function createdJson(info){

    const mkTitle = filenamify(info.title)//먼저 폴더를 변환해줍니다.
    const dir = mainDir //main dir 을 받아서 넣어줍시다(가독성)

    createFolder(dir,mkTitle)//먼저 폴더가 없다면 만들어줍니다.

    const inJson = dir+'/'+mkTitle
    saveJson(info,inJson)//Json 파일로 변환후 폴더에 저장합니다.
}


//create Obj to json file function
function saveJson(info,dir){
   
    const jsonFild =  JSON.stringify(info) //json 파일로 변환후
    
    const name = '/mangaInfo.json' //이름 지정

    fs.writeFile(dir+name, jsonFild,(err,result)=>{ // writeFile 사용하여 json 파일 만들기
        if(err) console.log('errer',err)
    });
}

//id랑 제목들 리턴해주는 함수
function rtTitlesHref($,$titles,$div,title){

    //href List
    const list = new Array();
    //titleList
    const titleList = new Array();

    //get ep title
    $titles.each(function(){
        titleList.push(filenamify(title+' '+$(this).contents().get(0).nodeValue.trim().split(title)[1].trim()))
    })//제목들 추출

    //get ep id => url 추출 사용
    $div.each(function(){
        list.push($(this).attr('href').split('id=')[1]);           
    });//id추출

    return {
        titles:titleList, //제목들 
        ids:list //id들
    }
}


//request안에서 만화정보 보네기
function rtManaGaInfo(options){

    const subUrl = `https://manamoa${number}.net/bbs/page.php?hid=manga_detail&manga_id=14940`
    
    
    const url = changeUrl(mainUrl,subUrl) // chnageUrl 사용하여 url 변경

    let info = {}
    
    options.uri = url // options 에 uri 값을 url 값으로 변경해줌

        return new Promise(resolve=>{
            request(options,(err,response,body)=>{
        
                //만약 에러나면
                if(err) console.log('err',err)
        
                const $ = cheerio.load(body);
                const $div = $('.slot > a'); //링크
                const $titles = $('.slot > a >.title');//제목들
                const title = $('.manga-subject').first().text().trim()//제목
                const mainImg = $('.manga-thumbnail').css('background-image')//메인 이미지
                const publish_type = $('.publish_type').text()//주간,월간,완결
        
        
                const titlesAId = rtTitlesHref($,$titles,$div,title)//타이틀과 아이디 받기
                
                info = {
                    title:title,
                    mainImg:mainImg,
                    publish_type:publish_type,
                    titlesAId:titlesAId
                }
                resolve(info)
            })
        }).then(function(result){
            return info
        })
}


//Url을 다른url로 chnage 
//나중에 아이디값으로 바꿔버리자
//chnageUrlId<<이름으로
function changeUrl(mainUrl,subUrl){//main Url + subUrl
    
    subUrl = subUrl.split(mainUrl)[1]
    
    const url = `${mainUrl}/${subUrl}` //뒷 url 합처줌
    
    return  url;

}

// function init()
async function init(){
    //함수 시작부분
    try{
        const info = await rtManaGaInfo(options)
        await createdJson(info)

    }
    catch(err){
        console.log(err)
    }

}init()



