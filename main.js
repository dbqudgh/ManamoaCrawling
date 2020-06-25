//모듈 불러오기
const request = require("request");
const filenamify = require("filenamify");
const cheerio = require("cheerio");
const fs = require('fs');
const replace = require("./lib/replace");


//mana숫자 < 숫자부분 주기적으로 바꿔줘야하니 나중에 숫자만 입력할수있도록 바꿔줘야함
let number = '48'

//첫주소
const mainUrl = `https://manamoa${number}.net/`

// 중요한 아이디값 일단 기본적으로 정해둠
let id = '14940'

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
        fs.mkdirSync(dir) //디렉토리를 생성합니다
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

//array 형식으로 추출해줌 
function rtList(option){

    //비구조화 할당 하면 이많은줄이 한줄이 되는 마술
    /*const $ = option.$
    const $chapterList = option.$chapterList
    const $id = options.$id
    const $tag = option.$tag
    const title = option.title*/ 
    
    //비구조화 활당 es6 문법 정말 정말 좋다
    const { $,$chapterList,$id,$tag,title } = option
    //$,홧수제목,id,태그,제목

    //id List
    const idList = new Array();
    //titleList
    const chapterList = new Array();
    //tag
    const tagList = new Array();

    //get ep title
    $chapterList.each(function(){
        chapterList.push(filenamify(title+' '+$(this).contents().get(0).nodeValue.trim().split(title)[1].trim()))
                        //제목변환후 제목 + 공백하나 넣어주고  텍스트 정보에 앞뒤 공백지워주고 제목으로 잘라서 만화 홧수 추출한것
                        //=> 축약하여 제목 + 홧수 )ex 진격의거인 30화
    })//제목들 추출

    $tag.each(function(){
        tagList.push($(this).text())
    })

    //get ep id => url 추출 사용
    $id.each(function(){
        idList.push($(this).attr('href').split('id=')[1]);           
    });//id추출

    return {
        chapters:chapterList, //제목들 
        ids:idList ,//id들
        tags:tagList
    }
}


//request안에서 만화정보 보네기
function rtManaGaInfo(options){

    //url number 이랑 id로 구분해주면 될것같음
    const subUrl = `https://manamoa${number}.net/bbs/page.php?hid=manga_detail&manga_id=${id}` 
    
    const url = changeUrl(mainUrl,subUrl) // chnageUrl 사용하여 url 변경

    let info = {} 
    
    
    options.uri = url // options 에 uri 값을 url 값으로 변경해줌

        return new Promise(resolve=>{ // 비동기사용하여 info return
            request(options,(err,response,body)=>{ 
        
                //만약 에러나면
                if(err) console.log('err',err)
                
                //더많은정보들을 넘겨줄수있다 검색)-managainfo
                const $ = cheerio.load(body);
                const $id = $('.slot > a'); //링크
                const $chapterList = $('.slot > a >.title');//챕터리스트
                const title = $('.manga-subject').first().text().trim()//제목
                const mainImg = $('.manga-thumbnail').css('background-image')//메인 이미지
                const $tag = $('.tag') // 태그 
                const author = $('.author').text().trim() //작가 
                const chapterCount = replace.fn($('.chapter-count').text()) //총 홧수
                const publish_type = $('.publish_type').text()//주간,월간,완결

                const option ={ //array로 받아야 할것들
                    $:$,
                    $chapterList:$chapterList,
                    $id:$id,
                    $tag:$tag,
                    title:title //
                }
                
                const list = rtList(option)//
            

                info = {
                    title:title, //제목
                    mainImg:mainImg, // 썸네일
                    publish_type:publish_type, //완결 또는 주간 월간인지 표시해줌
                    list:list, // 화제목+id값+태그
                    author:author, //작가
                    chapterCount:chapterCount //총홧수
                }
                resolve(info)
            })
        }).then(function(result){
            return info //정보 리턴
        })
}


//Url을 다른url로 chnage 
//나중에 아이디값으로 바꿔버리자
//chnageUrlId<<이름으로
function changeUrl(mainUrl,subUrl){//main Url + subUrl
    
    subUrl = subUrl.split(mainUrl)[1] // subUrl에서 앞부분 스플릿해준다음 더해줌
    
    const url = `${mainUrl}/${subUrl}` //뒷 url 합처줌
    
    return  url; 

}


//img function
//이미지 관련함수들 나중에 추후 추가해주자
function imgsDownload(){ // 이미지 다운로드 함수
    
}

function imgsLoad(info){// 이미지들을 불러와주는함수

}

// function init()
async function init(){
    //함수 시작부분
    try{
        const info = await rtManaGaInfo(options) // 만화정보를 리턴해줌
        await createdJson(info) // 그걸사용하여 json 파일에 정보 담아주기


    }
    catch(err){
        console.log(err)
    }

}init()


/*
오류 적어두는곳

1.태그 오류 중간에 \n 문자 그후 태그가 한번더 들어감 나중에 태그 사용할일 있을때 확인해주면 될 것 같음


*/



