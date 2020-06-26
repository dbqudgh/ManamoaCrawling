const request = require('request')
const fs = require('fs')



//설치경로,url,몇화ㅏ,몇번째이미지,에러 카운트
const down = (path, url,title,h,href,retry)=>{
    request({url: url, headers:{'referer': href}
    ,encoding: null},(error,Response,body)=>{
        // console.log('body',body)
//에러 5번 반복
        if(error && --retry>= 0){
            console.log('retry!:'+title+h)
            down(path, url,title,h,href,retry)
        }
//설치경로 , 이름 확장자 받고 다운로드
        fs.writeFile(path + '\\' + title+' '+ String(h)+'.jpg',body,null,(err)=>{
            if (err) throw err;//에러출력
            console.log(`${title}/${h}`)
            
            
        })
    })
}

module.exports = {
    down:down
}

