//mana숫자 < 숫자부분 주기적으로 바꿔줘야하니 나중에 숫자만 입력할수있도록 바꿔줘야함
let number = '50'

// 중요한 아이디값 일단 기본적으로 정해둠
let id = '10970'

//사용자가 원하는 다운로드 딜레이 속도 지정  컴퓨터 속도에 따라서 바꿔줌
let DOWNLOAD_SPEED = 5;


//첫주소
const mainUrl = `https://manamoa${number}.net/`
//만화 메인 주소 url number 이랑 id로 구분해주면 될것같음
const subUrl = `https://manamoa${number}.net/bbs/page.php?hid=manga_detail&manga_id=${id}` 
//만화 이미지 뷰 링크 마찬가지 nubmer id 구분해주기
const viewUrl = `https://manamoa${number}.net/bbs/board.php?bo_table=manga&wr_id=${id}`
    
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


module.exports = {
    number,
    id,
    DOWNLOAD_SPEED,
    mainUrl,
    subUrl,
    viewUrl,
    mainDir,
    options
}